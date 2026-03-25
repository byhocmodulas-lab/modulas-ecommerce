import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,
  ) {}

  findAllForUser(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.repo.update({ userId }, { isDefault: false });
    }
    const addr = this.repo.create({ ...dto, userId });
    return this.repo.save(addr);
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    const addr = await this.repo.findOne({ where: { id } });
    if (!addr) throw new NotFoundException(`Address ${id} not found`);
    if (addr.userId !== userId) throw new ForbiddenException();
    if (dto.isDefault) {
      await this.repo.update({ userId }, { isDefault: false });
    }
    await this.repo.update(id, dto as Partial<Address>);
    return this.repo.findOne({ where: { id } });
  }

  async remove(userId: string, id: string) {
    const addr = await this.repo.findOne({ where: { id } });
    if (!addr) throw new NotFoundException(`Address ${id} not found`);
    if (addr.userId !== userId) throw new ForbiddenException();
    await this.repo.delete(id);
  }
}
