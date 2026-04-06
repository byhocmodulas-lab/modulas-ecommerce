import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../../../orders/src/entities/order.entity';
import { User } from '../../../../auth/src/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';

const DASHBOARD_CACHE_TTL_MS = 60_000; // 60 seconds

@Injectable()
export class AnalyticsService {
  private dashboardCache: { data: unknown; expiresAt: number } | null = null;

  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(User)  private readonly users:  Repository<User>,
    @InjectRepository(Lead)  private readonly leads:  Repository<Lead>,
  ) {}

  async dashboard() {
    // Return cached result if still fresh
    if (this.dashboardCache && Date.now() < this.dashboardCache.expiresAt) {
      return this.dashboardCache.data;
    }

    const data = await this.queryDashboard();
    this.dashboardCache = { data, expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS };
    return data;
  }

  /** Invalidate cache — call after orders/users change if needed */
  invalidateDashboardCache() {
    this.dashboardCache = null;
  }

  private async queryDashboard() {
    const now = new Date();
    const startOfMonth    = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalOrders,
      totalUsers,
      totalLeads,
      revenueResult,
      prevRevenueResult,
      monthOrdersResult,
      prevMonthOrdersResult,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      this.orders.count(),
      this.users.count(),
      this.leads.count(),

      // Total revenue (delivered + confirmed)
      this.orders
        .createQueryBuilder('o')
        .select('COALESCE(SUM(o.totalAmount), 0)', 'total')
        .where('o.status NOT IN (:...excluded)', { excluded: [OrderStatus.Cancelled, OrderStatus.Refunded] })
        .getRawOne<{ total: string }>(),

      // Prev month revenue
      this.orders
        .createQueryBuilder('o')
        .select('COALESCE(SUM(o.totalAmount), 0)', 'total')
        .where('o.status NOT IN (:...excluded)', { excluded: [OrderStatus.Cancelled, OrderStatus.Refunded] })
        .andWhere('o.createdAt BETWEEN :start AND :end', { start: startOfPrevMonth, end: endOfPrevMonth })
        .getRawOne<{ total: string }>(),

      // This month orders
      this.orders
        .createQueryBuilder('o')
        .select('COUNT(*)', 'count')
        .where('o.createdAt >= :start', { start: startOfMonth })
        .getRawOne<{ count: string }>(),

      // Prev month orders
      this.orders
        .createQueryBuilder('o')
        .select('COUNT(*)', 'count')
        .where('o.createdAt BETWEEN :start AND :end', { start: startOfPrevMonth, end: endOfPrevMonth })
        .getRawOne<{ count: string }>(),

      // Recent 10 orders
      this.orders.find({
        order: { createdAt: 'DESC' },
        take: 10,
        select: ['id', 'status', 'totalAmount', 'currency', 'createdAt', 'userId'],
      }),

      // Order count by status
      this.orders
        .createQueryBuilder('o')
        .select('o.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('o.status')
        .getRawMany<{ status: string; count: string }>(),
    ]);

    const revenue          = parseFloat(revenueResult?.total ?? '0');
    const prevRevenue      = parseFloat(prevRevenueResult?.total ?? '0');
    const monthOrders      = parseInt(monthOrdersResult?.count ?? '0', 10);
    const prevMonthOrders  = parseInt(prevMonthOrdersResult?.count ?? '0', 10);

    return {
      kpis: {
        totalOrders,
        totalUsers,
        totalLeads,
        totalRevenue: revenue,
        revenueGrowth: prevRevenue > 0 ? +((revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : null,
        monthOrders,
        ordersGrowth: prevMonthOrders > 0 ? +((monthOrders - prevMonthOrders) / prevMonthOrders * 100).toFixed(1) : null,
      },
      ordersByStatus: ordersByStatus.reduce<Record<string, number>>((acc, row) => {
        acc[row.status] = parseInt(row.count, 10);
        return acc;
      }, {}),
      recentOrders,
    };
  }
}
