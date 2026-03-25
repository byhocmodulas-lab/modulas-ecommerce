import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
  ) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    return this.profileRepo.findOne({ where: { userId } });
  }

  async upsert(userId: string, dto: UpsertProfileDto): Promise<UserProfile> {
    let profile = await this.findByUserId(userId);

    if (!profile) {
      profile = this.profileRepo.create({ userId });
    }

    if (dto.fullName !== undefined)     profile.fullName    = dto.fullName;
    if (dto.phone !== undefined)        profile.phone       = dto.phone;
    if (dto.address !== undefined)      profile.address     = dto.address;
    if (dto.companyName !== undefined)  profile.companyName = dto.companyName;
    if (dto.website !== undefined)      profile.website     = dto.website;
    if (dto.requirements !== undefined) profile.requirements = dto.requirements;

    return this.profileRepo.save(profile);
  }

  // ── Admin: export all profiles as CSV ────────────────────────
  async exportCsv(): Promise<string> {
    const profiles = await this.profileRepo
      .createQueryBuilder('p')
      .select([
        'p.userId', 'p.fullName', 'p.phone', 'p.companyName',
        'p.address', 'p.requirements', 'p.createdAt',
      ])
      .orderBy('p.createdAt', 'DESC')
      .getRawMany();

    const header = 'userId,fullName,phone,companyName,city,country,pincode,projectType,budgetRange,createdAt\n';

    const rows = profiles.map((r) => {
      const addr = r.p_address ?? {};
      const req  = r.p_requirements ?? {};
      return [
        r.p_userId,
        `"${(r.p_fullName ?? '').replace(/"/g, '""')}"`,
        r.p_phone ?? '',
        `"${(r.p_companyName ?? '').replace(/"/g, '""')}"`,
        addr.city ?? '',
        addr.country ?? '',
        addr.pincode ?? '',
        req.projectType ?? '',
        `"${(req.budgetRange ?? '').replace(/"/g, '""')}"`,
        new Date(r.p_createdAt).toISOString().slice(0, 10),
      ].join(',');
    });

    return header + rows.join('\n');
  }
}
