import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Article } from "./entities/article.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { ArticleQueryDto } from "./dto/article-query.dto";


@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async create(dto: CreateArticleDto, authorId: string): Promise<Article> {
    const readingTime = Math.ceil(dto.content.split(/\s+/).length / 200);
    const article = this.articleRepo.create({
      ...dto,
      authorId,
      readingTimeMin: readingTime,
    });
    return this.articleRepo.save(article);
  }

  async findPublished(query: ArticleQueryDto) {
    const qb = this.articleRepo
      .createQueryBuilder("a")
      .leftJoinAndSelect("a.author", "author")
      .where("a.status = :status", { status: "published" })
      .andWhere("a.published_at IS NOT NULL");

    if (query.category) {
      qb.andWhere("a.category = :category", { category: query.category });
    }
    if (query.tag) {
      qb.andWhere(":tag = ANY(a.tags)", { tag: query.tag });
    }
    if (query.contentType) {
      qb.andWhere("a.content_type = :type", { type: query.contentType });
    }
    if (query.locale) {
      qb.andWhere("a.locale = :locale", { locale: query.locale });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const [articles, total] = await qb
      .orderBy("a.published_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { articles, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepo.findOne({
      where: { slug, status: "published" },
      relations: ["author", "linkedProducts"],
    });
    if (!article) throw new NotFoundException(`Article ${slug} not found`);

    // Increment view count
    await this.articleRepo.increment({ id: article.id }, "viewCount", 1);

    return article;
  }

  async updateStatus(id: string, status: string): Promise<Article> {
    const update: Partial<Article> = { status: status as Article['status'] };
    if (status === "published") {
      update.publishedAt = new Date();
    }
    await this.articleRepo.update(id, update as any);

    const article = await this.articleRepo.findOneBy({ id });
    if (!article) throw new NotFoundException(`Article ${id} not found`);

    // Index in Elasticsearch when published
    if (status === "published") {
      await (this.elasticsearchService as any).index({
        index: "articles",
        id,
        document: {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          publishedAt: article.publishedAt,
          locale: article.locale,
        },
      });
    }

    return article;
  }

  async getDrafts(authorId: string) {
    return this.articleRepo.find({
      where: { authorId, status: "draft" },
      order: { updatedAt: "DESC" },
    });
  }

  /** Admin list — all articles across statuses with optional search/status filter */
  async adminList(query: ArticleQueryDto) {
    const page  = query.page  ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.articleRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.author', 'author');

    if (query.status) {
      qb.andWhere('a.status = :status', { status: query.status });
    }
    if (query.category) {
      qb.andWhere('a.category = :category', { category: query.category });
    }
    if (query.search) {
      qb.andWhere('(a.title ILIKE :s OR a.excerpt ILIKE :s)', { s: `%${query.search}%` });
    }

    const [articles, total] = await qb
      .orderBy('a.updated_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { articles, total, page, totalPages: Math.ceil(total / limit) };
  }

  /** Update article fields */
  async updateArticle(id: string, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleRepo.findOneBy({ id });
    if (!article) throw new NotFoundException(`Article ${id} not found`);
    Object.assign(article, dto);
    if (dto.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    return this.articleRepo.save(article);
  }

  /** Delete article */
  async remove(id: string): Promise<void> {
    const article = await this.articleRepo.findOneBy({ id });
    if (!article) throw new NotFoundException(`Article ${id} not found`);
    await this.articleRepo.remove(article);
  }

  async linkProducts(articleId: string, productIds: string[]) {
    const values = productIds.map((pid, i) => ({
      articleId,
      productId: pid,
      sortOrder: i,
    }));
    await this.articleRepo.query(
      `DELETE FROM article_products WHERE article_id = $1`,
      [articleId],
    );
    await this.articleRepo
      .createQueryBuilder()
      .insert()
      .into("article_products")
      .values(values)
      .execute();
  }
}
