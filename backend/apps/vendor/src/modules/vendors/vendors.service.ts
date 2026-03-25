import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vendor } from "./entities/vendor.entity";
import { VendorUser } from "./entities/vendor-user.entity";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(VendorUser)
    private readonly vendorUserRepo: Repository<VendorUser>,
  ) {}

  async create(dto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepo.create(dto);
    return this.vendorRepo.save(vendor);
  }

  async findAll(filters: { tier?: string; isActive?: boolean }) {
    const qb = this.vendorRepo.createQueryBuilder("vendor");

    if (filters.tier) {
      qb.andWhere("vendor.tier = :tier", { tier: filters.tier });
    }
    if (filters.isActive !== undefined) {
      qb.andWhere("vendor.is_active = :isActive", { isActive: filters.isActive });
    }

    return qb.orderBy("vendor.name", "ASC").getMany();
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ["products", "collections"],
    });
    if (!vendor) throw new NotFoundException(`Vendor ${id} not found`);
    return vendor;
  }

  async update(id: string, dto: UpdateVendorDto): Promise<Vendor> {
    await this.vendorRepo.update(id, dto);
    return this.findOne(id);
  }

  async addMember(vendorId: string, userId: string, role: string) {
    const membership = this.vendorUserRepo.create({
      vendorId,
      userId,
      role,
    });
    return this.vendorUserRepo.save(membership);
  }

  async checkMembership(vendorId: string, userId: string): Promise<VendorUser> {
    const membership = await this.vendorUserRepo.findOne({
      where: { vendorId, userId },
    });
    if (!membership) {
      throw new ForbiddenException("Not a member of this vendor");
    }
    return membership;
  }

  async getVendorAnalytics(vendorId: string) {
    // Aggregate order data for vendor products
    const result = await this.vendorRepo.query(
      `
      SELECT
        COUNT(DISTINCT o.id) as total_orders,
        SUM(oi.unit_price * oi.quantity) as total_revenue,
        COUNT(DISTINCT oi.product_id) as products_sold,
        AVG(oi.unit_price) as avg_order_value
      FROM vendor_products vp
      JOIN order_items oi ON oi.product_id = vp.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE vp.vendor_id = $1
        AND o.status NOT IN ('cancelled', 'refunded')
    `,
      [vendorId],
    );

    return result[0];
  }
}
