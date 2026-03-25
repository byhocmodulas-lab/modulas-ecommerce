import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Workshop } from "./entities/workshop.entity";
import { WorkshopEnrollment } from "./entities/enrollment.entity";
import { Certificate } from "./entities/certificate.entity";
import { CreateWorkshopDto } from "./dto/create-workshop.dto";
import { EnrollDto } from "./dto/enroll.dto";

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepo: Repository<Workshop>,
    @InjectRepository(WorkshopEnrollment)
    private readonly enrollmentRepo: Repository<WorkshopEnrollment>,
    @InjectRepository(Certificate)
    private readonly certRepo: Repository<Certificate>,
    @InjectQueue("certificate-generation")
    private readonly certQueue: Queue,
  ) {}

  async create(dto: CreateWorkshopDto): Promise<Workshop> {
    const workshop = this.workshopRepo.create(dto);
    return this.workshopRepo.save(workshop);
  }

  async findPublished(filters: { type?: string; skillLevel?: string }) {
    const qb = this.workshopRepo
      .createQueryBuilder("w")
      .where("w.status = :status", { status: "published" });

    if (filters.type) qb.andWhere("w.type = :type", { type: filters.type });
    if (filters.skillLevel)
      qb.andWhere("w.skill_level = :level", { level: filters.skillLevel });

    return qb.orderBy("w.starts_at", "ASC").getMany();
  }

  async findBySlug(slug: string): Promise<Workshop> {
    const workshop = await this.workshopRepo.findOne({
      where: { slug },
      relations: ["instructor", "enrollments"],
    });
    if (!workshop) throw new NotFoundException(`Workshop ${slug} not found`);
    return workshop;
  }

  async enroll(workshopId: string, userId: string): Promise<WorkshopEnrollment> {
    const workshop = await this.workshopRepo.findOneBy({ id: workshopId });
    if (!workshop) throw new NotFoundException("Workshop not found");

    if (workshop.status === "full") {
      throw new BadRequestException("Workshop is full");
    }

    const existing = await this.enrollmentRepo.findOne({
      where: { workshopId, userId },
    });
    if (existing) throw new BadRequestException("Already enrolled");

    const enrollmentCount = await this.enrollmentRepo.count({ where: { workshopId } });
    if (enrollmentCount >= workshop.maxSeats) {
      await this.workshopRepo.update(workshopId, { status: "full" });
      throw new BadRequestException("Workshop is full");
    }

    const enrollment = this.enrollmentRepo.create({ workshopId, userId });
    return this.enrollmentRepo.save(enrollment);
  }

  async complete(enrollmentId: string): Promise<Certificate> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId },
      relations: ["workshop", "user"],
    });
    if (!enrollment) throw new NotFoundException("Enrollment not found");

    enrollment.status = "completed";
    enrollment.completedAt = new Date();
    await this.enrollmentRepo.save(enrollment);

    // Generate certificate
    const certNumber = `MOD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const certificate = this.certRepo.create({
      enrollmentId,
      userId: enrollment.userId,
      workshopId: enrollment.workshopId,
      certificateNumber: certNumber,
    });
    const saved = await this.certRepo.save(certificate);

    // Queue PDF generation
    await this.certQueue.add("generate-pdf", {
      certificateId: saved.id,
      userName: enrollment.user?.fullName,
      workshopTitle: enrollment.workshop?.title,
      certNumber,
    });

    return saved;
  }

  async getUserEnrollments(userId: string) {
    return this.enrollmentRepo.find({
      where: { userId },
      relations: ["workshop"],
      order: { enrolledAt: "DESC" },
    });
  }
}
