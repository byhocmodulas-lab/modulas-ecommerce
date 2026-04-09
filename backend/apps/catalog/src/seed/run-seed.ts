/**
 * Modulas Catalog Seed Runner
 *
 * Inserts all 5 category seed arrays into the database via TypeORM.
 * Run with:  npx ts-node -r tsconfig-paths/register src/seed/run-seed.ts
 *
 * The script is idempotent — it uses INSERT ... ON CONFLICT DO NOTHING
 * (via upsert with the `skip` strategy), so re-running is safe.
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

import { Category, Product, ProductImage } from '../modules/products/entities/product.entity';
import { SeedProduct } from './catalog.seed';
import { SEATING_SOFAS } from './catalog.seed';
import { BEDS_BEDROOM } from './catalog-bedroom.seed';
import { DINING } from './catalog-dining.seed';
import { STUDY_OFFICE } from './catalog-study.seed';
import { LIVING_ROOM } from './catalog-living.seed';
import { MODULAR_KITCHENS, MODULAR_WARDROBES } from './catalog-modular.seed';

// ─── Load env ──────────────────────────────────────────────────────────────
config({ path: join(__dirname, '../../../../.env') });

const ALL_PRODUCTS: SeedProduct[] = [
  ...SEATING_SOFAS,
  ...BEDS_BEDROOM,
  ...DINING,
  ...STUDY_OFFICE,
  ...LIVING_ROOM,
  ...MODULAR_KITCHENS,
  ...MODULAR_WARDROBES,
];

// ─── Category taxonomy ──────────────────────────────────────────────────────
const CATEGORY_TREE: Array<{
  slug: string;
  name: string;
  sortOrder: number;
  subcategories: Array<{ slug: string; name: string; sortOrder: number }>;
}> = [
  {
    slug: 'sofas',
    name: 'Seating & Sofas',
    sortOrder: 1,
    subcategories: [
      { slug: '3-seater-sofas', name: '3-Seater Sofas', sortOrder: 1 },
      { slug: 'sectional-sofas', name: 'Sectional Sofas', sortOrder: 2 },
      { slug: '2-seater-sofas', name: '2-Seater Sofas', sortOrder: 3 },
      { slug: 'accent-chairs', name: 'Accent Chairs', sortOrder: 4 },
      { slug: 'ottomans-poufs', name: 'Ottomans & Poufs', sortOrder: 5 },
      { slug: 'daybeds-chaises', name: 'Daybeds & Chaises', sortOrder: 6 },
    ],
  },
  {
    slug: 'bedroom',
    name: 'Beds & Bedroom',
    sortOrder: 2,
    subcategories: [
      { slug: 'upholstered-beds', name: 'Upholstered Beds', sortOrder: 1 },
      { slug: 'bed-frames', name: 'Bed Frames', sortOrder: 2 },
      { slug: 'storage-beds', name: 'Storage Beds', sortOrder: 3 },
      { slug: 'wardrobes', name: 'Wardrobes', sortOrder: 4 },
      { slug: 'nightstands', name: 'Nightstands', sortOrder: 5 },
      { slug: 'dressers-vanities', name: 'Dressers & Vanities', sortOrder: 6 },
      { slug: 'bedroom-benches', name: 'Bedroom Benches', sortOrder: 7 },
    ],
  },
  {
    slug: 'dining',
    name: 'Dining',
    sortOrder: 3,
    subcategories: [
      { slug: 'dining-tables', name: 'Dining Tables', sortOrder: 1 },
      { slug: 'dining-chairs', name: 'Dining Chairs', sortOrder: 2 },
      { slug: 'extendable-tables', name: 'Extendable Tables', sortOrder: 3 },
      { slug: 'sideboards', name: 'Sideboards', sortOrder: 4 },
      { slug: 'bar-stools', name: 'Bar Stools', sortOrder: 5 },
      { slug: 'bar-cabinets', name: 'Bar Cabinets', sortOrder: 6 },
    ],
  },
  {
    slug: 'study',
    name: 'Study & Office',
    sortOrder: 4,
    subcategories: [
      { slug: 'writing-desks', name: 'Writing Desks', sortOrder: 1 },
      { slug: 'executive-desks', name: 'Executive Desks', sortOrder: 2 },
      { slug: 'standing-desks', name: 'Standing Desks', sortOrder: 3 },
      { slug: 'office-chairs', name: 'Office Chairs', sortOrder: 4 },
      { slug: 'bookshelves', name: 'Bookshelves', sortOrder: 5 },
      { slug: 'study-armchairs', name: 'Study Armchairs', sortOrder: 6 },
    ],
  },
  {
    slug: 'living',
    name: 'Living Room',
    sortOrder: 5,
    subcategories: [
      { slug: 'coffee-tables', name: 'Coffee Tables', sortOrder: 1 },
      { slug: 'side-tables', name: 'Side Tables', sortOrder: 2 },
      { slug: 'console-tables', name: 'Console Tables', sortOrder: 3 },
      { slug: 'tv-units', name: 'TV Units', sortOrder: 4 },
      { slug: 'display-shelving', name: 'Display Shelving', sortOrder: 5 },
      { slug: 'floor-lamps', name: 'Floor Lamps', sortOrder: 6 },
    ],
  },
  {
    slug: 'modular-kitchens',
    name: 'Modular Kitchens',
    sortOrder: 6,
    subcategories: [
      { slug: 'straight-kitchen',  name: 'Straight Kitchen',  sortOrder: 1 },
      { slug: 'l-shape-kitchen',   name: 'L-Shape Kitchen',   sortOrder: 2 },
      { slug: 'parallel-kitchen',  name: 'Parallel Kitchen',  sortOrder: 3 },
      { slug: 'u-shape-kitchen',   name: 'U-Shape Kitchen',   sortOrder: 4 },
      { slug: 'island-kitchen',    name: 'Island Kitchen',    sortOrder: 5 },
      { slug: 'handleless-kitchen',name: 'Handleless Kitchen',sortOrder: 6 },
    ],
  },
  {
    slug: 'modular-wardrobes',
    name: 'Modular Wardrobes',
    sortOrder: 7,
    subcategories: [
      { slug: 'sliding-wardrobe',  name: 'Sliding Door Wardrobe', sortOrder: 1 },
      { slug: 'hinged-wardrobe',   name: 'Hinged Door Wardrobe',  sortOrder: 2 },
      { slug: 'walk-in-wardrobe',  name: 'Walk-In Wardrobe',      sortOrder: 3 },
      { slug: 'kids-wardrobe',     name: 'Kids Wardrobe',         sortOrder: 4 },
      { slug: 'loft-wardrobe',     name: 'Loft Wardrobe',         sortOrder: 5 },
    ],
  },
];

// ─── DataSource ─────────────────────────────────────────────────────────────
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'modulas',
  entities: [Category, Product, ProductImage],
  synchronize: false,
  logging: false,
});

// ─── Helpers ────────────────────────────────────────────────────────────────
function randomFileKey(): string {
  return Math.random().toString(36).substring(2, 12);
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  await AppDataSource.initialize();
  console.log('✓ Database connected');

  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);
  const imageRepo = AppDataSource.getRepository(ProductImage);

  // ── 1. Upsert categories ─────────────────────────────────────────────────
  console.log('\nSeeding categories…');
  const categoryMap = new Map<string, Category>();

  for (const cat of CATEGORY_TREE) {
    let parent = await categoryRepo.findOne({ where: { slug: cat.slug } });
    if (!parent) {
      parent = categoryRepo.create({
        slug: cat.slug,
        name: cat.name,
        sortOrder: cat.sortOrder,
      });
      await categoryRepo.save(parent);
      console.log(`  + ${cat.name}`);
    } else {
      console.log(`  ~ ${cat.name} (exists)`);
    }
    categoryMap.set(cat.slug, parent);

    for (const sub of cat.subcategories) {
      let child = await categoryRepo.findOne({ where: { slug: sub.slug } });
      if (!child) {
        child = categoryRepo.create({
          slug: sub.slug,
          name: sub.name,
          sortOrder: sub.sortOrder,
          parent,
        });
        await categoryRepo.save(child);
        console.log(`    + ${sub.name}`);
      } else {
        console.log(`    ~ ${sub.name} (exists)`);
      }
      categoryMap.set(sub.slug, child);
    }
  }

  // ── 2. Upsert products ───────────────────────────────────────────────────
  console.log('\nSeeding products…');
  let created = 0;
  let skipped = 0;

  for (const seed of ALL_PRODUCTS) {
    const existing = await productRepo.findOne({ where: { sku: seed.sku } });
    if (existing) {
      skipped++;
      continue;
    }

    const category = categoryMap.get(seed.categorySlug);
    if (!category) {
      console.warn(`  ! Category not found for slug "${seed.categorySlug}" — skipping ${seed.sku}`);
      continue;
    }

    // Build tags: always include subcategory:<slug>
    const tags: string[] = [...(seed.tags ?? [])];
    const subTag = `subcategory:${seed.subcategorySlug}`;
    if (!tags.includes(subTag)) tags.push(subTag);

    const product = productRepo.create({
      sku: seed.sku,
      slug: seed.slug,
      name: seed.name,
      description: seed.description,
      category,
      price: seed.price,
      compareAtPrice: seed.compareAtPrice,
      currency: seed.currency,
      brand: seed.brand,
      stockQty: seed.stockQty,
      leadTimeDays: seed.leadTimeDays,
      seoTitle: seed.seoTitle,
      seoDescription: seed.seoDescription,
      isFeatured: seed.isFeatured,
      material: seed.material,
      finishOptions: seed.finishOptions,
      dimensions: seed.dimensions as Record<string, unknown>,
      weightKg: seed.weightKg,
      isConfigurable: seed.isConfigurable,
      tags,
      isActive: true,
      metadata: {
        fullDescription: seed.metadata.fullDescription,
        features: seed.metadata.features,
        care: seed.metadata.care,
        warranty: seed.metadata.warranty,
        rating: seed.metadata.rating,
        reviewCount: seed.metadata.reviewCount,
      },
    });

    const savedProduct = (await productRepo.save(product)) as Product;

    // ── Images ──
    const imageEntities: ProductImage[] = (seed.images ?? []).map((img, idx) =>
      imageRepo.create({
        product: { id: savedProduct.id } as Product,
        url: img.url,
        fileKey: randomFileKey(),
        altText: img.alt ?? img.altText ?? '',
        sortOrder: img.sortOrder ?? idx,
        isPrimary: img.isPrimary === true || idx === 0,
      }),
    );

    if (imageEntities.length > 0) {
      await imageRepo.save(imageEntities);
    }

    created++;
    if (created % 10 === 0) {
      console.log(`  … ${created} products inserted`);
    }
  }

  console.log(`\n✓ Seed complete`);
  console.log(`  Created : ${created} products`);
  console.log(`  Skipped : ${skipped} products (already exist)`);
  console.log(`  Total   : ${ALL_PRODUCTS.length} products in seed data`);

  await AppDataSource.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
