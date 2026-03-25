import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './entities/order.entity';
import { Cart } from './entities/cart.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { Role } from '../../../libs/common/src/enums/role.enum';
import { User } from '../../auth/src/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
  ) {}

  // ─── Cart ───────────────────────────────────────────────────────

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addToCart(userId: string, dto: AddCartItemDto): Promise<Cart> {
    const cart = await this.getCart(userId);

    const existing = cart.items.find(
      (i) => i.productId === dto.productId && i.configurationId === dto.configurationId,
    );

    if (existing) {
      existing.quantity += dto.quantity;
    } else {
      cart.items.push({
        productId: dto.productId,
        configurationId: dto.configurationId,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        finish: dto.finish,
        customSpecs: dto.customSpecs,
      });
    }

    return this.cartRepo.save(cart);
  }

  async removeFromCart(userId: string, productId: string, configurationId?: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(
      (i) => !(i.productId === productId && i.configurationId === configurationId),
    );
    return this.cartRepo.save(cart);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (cart) {
      cart.items = [];
      await this.cartRepo.save(cart);
    }
  }

  // ─── Checkout ───────────────────────────────────────────────────

  async checkout(
    userId: string,
    dto: {
      shippingAddress: Record<string, unknown>;
      currency?: string;
      affiliateCode?: string;
      notes?: string;
    },
  ): Promise<{ order: Order; checkoutUrl: string }> {
    const cart = await this.getCart(userId);
    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      userId,
      totalAmount,
      currency: dto.currency ?? 'GBP',
      shippingAddress: dto.shippingAddress,
      notes: dto.notes,
      affiliateCode: dto.affiliateCode,
      items: cart.items.map((item) =>
        this.itemRepo.create({
          productId: item.productId,
          configurationId: item.configurationId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          finish: item.finish,
          customSpecs: item.customSpecs,
        }),
      ),
    });

    const saved = await this.orderRepo.save(order);

    // Clear cart after successful order creation
    await this.clearCart(userId);

    return { order: saved, checkoutUrl: `/checkout/${saved.id}` };
  }

  // ─── Orders ─────────────────────────────────────────────────────

  async create(dto: CreateOrderDto, userId: string): Promise<Order> {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      userId,
      totalAmount,
      currency: dto.currency ?? 'GBP',
      shippingAddress: dto.shippingAddress as unknown as Record<string, unknown>,
      notes: dto.notes,
      affiliateCode: dto.affiliateCode,
      items: dto.items.map((item) =>
        this.itemRepo.create({
          productId: item.productId,
          configurationId: item.configurationId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          finish: item.finish,
          customSpecs: item.customSpecs,
        }),
      ),
    });

    return this.orderRepo.save(order);
  }

  async findAll(user: User): Promise<Order[]> {
    if (user.role === Role.MasterAdmin || user.role === Role.Editor) {
      return this.orderRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.orderRepo.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async adminListOrders(filters: { status?: OrderStatus; page?: number; limit?: number }) {
    const { status, page = 1, limit = 50 } = filters;
    const where = status ? { status } : {};
    const [orders, total] = await this.orderRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, user: User): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    this.assertAccess(order, user);
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, user: User): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    if (user.role !== Role.MasterAdmin && user.role !== Role.Editor) {
      this.assertAccess(order, user);
      if (dto.status !== OrderStatus.Cancelled || order.status !== OrderStatus.Pending) {
        throw new ForbiddenException('Customers may only cancel pending orders');
      }
    }

    order.status = dto.status;
    return this.orderRepo.save(order);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.orderRepo.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async exportCsv(filters: { status?: OrderStatus; from?: string; to?: string }): Promise<string> {
    const qb = this.orderRepo.createQueryBuilder('o').orderBy('o.created_at', 'DESC');

    if (filters.status) qb.andWhere('o.status = :status', { status: filters.status });
    if (filters.from)   qb.andWhere('o.created_at >= :from', { from: new Date(filters.from) });
    if (filters.to)     qb.andWhere('o.created_at <= :to',   { to: new Date(filters.to) });

    const orders = await qb.getMany();

    const header = 'orderId,userId,status,totalAmount,currency,itemCount,affiliateCode,createdAt\n';
    const rows = orders.map((o) =>
      [
        o.id,
        o.userId,
        o.status,
        o.totalAmount,
        o.currency,
        (o.items ?? []).length,
        o.affiliateCode ?? '',
        new Date(o.createdAt).toISOString().slice(0, 10),
      ].join(','),
    );

    return header + rows.join('\n');
  }

  private assertAccess(order: Order, user: User): void {
    if (user.role !== Role.MasterAdmin && user.role !== Role.Editor && order.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }
  }
}
