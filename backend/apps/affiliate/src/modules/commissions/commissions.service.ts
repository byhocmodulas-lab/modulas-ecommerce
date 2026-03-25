import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Commission } from "./entities/commission.entity";
import { CommissionLedger } from "./entities/commission-ledger.entity";
import { Creator } from "../creators/entities/creator.entity";
import { OrderCompletedEvent } from "@modulas/messaging/events";

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,
    @InjectRepository(CommissionLedger)
    private readonly ledgerRepo: Repository<CommissionLedger>,
    @InjectRepository(Creator)
    private readonly creatorRepo: Repository<Creator>,
    private readonly dataSource: DataSource,
    @InjectQueue("payouts")
    private readonly payoutQueue: Queue,
  ) {}

  /**
   * Called when an order is completed via a tracked affiliate link.
   * Calculates commission, writes to ledger, schedules payout.
   */
  async handleOrderCompleted(event: OrderCompletedEvent): Promise<void> {
    const { orderId, affiliateCode, orderTotal, lineItems } = event;

    const creator = await this.creatorRepo.findOne({
      where: { affiliateCode },
      relations: ["commissionTier"],
    });
    if (!creator) return;

    const rate = creator.commissionTier?.rate ?? 0.1; // default 10%
    const commissionAmount = orderTotal * rate;

    await this.dataSource.transaction(async (manager) => {
      const commission = manager.create(Commission, {
        creatorId: creator.id,
        orderId,
        orderTotal,
        rate,
        amount: commissionAmount,
        status: "pending",
        lineItems,
      });
      await manager.save(commission);

      const ledgerEntry = manager.create(CommissionLedger, {
        creatorId: creator.id,
        commissionId: commission.id,
        type: "earn",
        amount: commissionAmount,
        balance: creator.pendingBalance + commissionAmount,
      });
      await manager.save(ledgerEntry);

      await manager.update(Creator, creator.id, {
        pendingBalance: creator.pendingBalance + commissionAmount,
      });
    });

    // Schedule payout check (runs on monthly cycle)
    await this.payoutQueue.add(
      "check-payout-threshold",
      { creatorId: creator.id },
      { delay: 0 },
    );
  }

  async getCreatorEarnings(creatorId: string) {
    return this.ledgerRepo.find({
      where: { creatorId },
      order: { createdAt: "DESC" },
    });
  }
}
