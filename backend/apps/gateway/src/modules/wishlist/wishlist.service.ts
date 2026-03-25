import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly repo: Repository<WishlistItem>,
  ) {}

  getForUser(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async add(userId: string, productId: string) {
    const existing = await this.repo.findOne({ where: { userId, productId } });
    if (existing) throw new ConflictException('Product already in wishlist');
    const item = this.repo.create({ userId, productId });
    return this.repo.save(item);
  }

  async remove(userId: string, productId: string) {
    await this.repo.delete({ userId, productId });
  }

  /** Sync bulk — replaces server wishlist with client list (called on login) */
  async sync(userId: string, productIds: string[]) {
    await this.repo.delete({ userId });
    if (productIds.length === 0) return [];
    const items = productIds.map((productId) =>
      this.repo.create({ userId, productId }),
    );
    return this.repo.save(items);
  }
}
