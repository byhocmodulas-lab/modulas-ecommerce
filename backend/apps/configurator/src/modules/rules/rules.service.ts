import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ModuleRule } from "./entities/module-rule.entity";
import { ConfiguredModule } from "../configurations/entities/configured-module.entity";

/**
 * Rule engine for validating furniture module combinations.
 *
 * Rules are stored in DB and evaluated against a configuration snapshot.
 * Rule types:
 *   - REQUIRES: module A requires module B to be present
 *   - EXCLUDES: module A cannot coexist with module B
 *   - MAX_COUNT: max instances of a module type
 *   - POSITION: module must be placed at specific grid positions
 */
@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(ModuleRule)
    private readonly ruleRepo: Repository<ModuleRule>,
  ) {}

  async validateConfiguration(
    productId: string,
    modules: ConfiguredModule[],
  ): Promise<{ valid: boolean; violations: string[] }> {
    const rules = await this.ruleRepo.find({ where: { productId } });
    const violations: string[] = [];

    for (const rule of rules) {
      switch (rule.type) {
        case "REQUIRES": {
          const hasSource = modules.some((m) => m.moduleTypeId === rule.sourceModuleTypeId);
          const hasTarget = modules.some((m) => m.moduleTypeId === rule.targetModuleTypeId);
          if (hasSource && !hasTarget) {
            violations.push(
              `"${rule.sourceName}" requires "${rule.targetName}" to also be included.`,
            );
          }
          break;
        }

        case "EXCLUDES": {
          const hasSource = modules.some((m) => m.moduleTypeId === rule.sourceModuleTypeId);
          const hasTarget = modules.some((m) => m.moduleTypeId === rule.targetModuleTypeId);
          if (hasSource && hasTarget) {
            violations.push(
              `"${rule.sourceName}" cannot be combined with "${rule.targetName}".`,
            );
          }
          break;
        }

        case "MAX_COUNT": {
          const count = modules.filter((m) => m.moduleTypeId === rule.sourceModuleTypeId).length;
          if (count > rule.maxCount!) {
            violations.push(
              `Maximum ${rule.maxCount} "${rule.sourceName}" modules allowed.`,
            );
          }
          break;
        }
      }
    }

    return { valid: violations.length === 0, violations };
  }

  async calculatePrice(
    productId: string,
    modules: ConfiguredModule[],
    finish: string,
  ): Promise<number> {
    // Base prices from module definitions + finish multipliers
    const baseTotal = modules.reduce((sum, m) => sum + m.basePrice, 0);
    const finishMultipliers: Record<string, number> = {
      "natural-oak": 1.0,
      "smoked-oak": 1.15,
      "ebony": 1.35,
      "white-ash": 1.1,
    };
    return Math.round(baseTotal * (finishMultipliers[finish] ?? 1.0) * 100) / 100;
  }
}
