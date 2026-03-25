export enum Role {
  /** Platform super-administrator */
  MasterAdmin = 'master_admin',

  /** Regular end customer */
  Customer = 'customer',

  /** Verified architect / interior designer (trade pricing) */
  Architect = 'architect',

  /** Social media creator / affiliate */
  Creator = 'creator',

  /** Brand or supply-chain vendor collaborator */
  Vendor = 'vendor',

  /** Workshop student / intern */
  Intern = 'intern',

  /** Content editor (blog, SEO) — internal staff */
  Editor = 'editor',
}

/** Roles that can access the admin dashboard */
export const ADMIN_ROLES = [Role.MasterAdmin, Role.Editor] as const;

/** Roles that receive trade (discounted) pricing */
export const TRADE_ROLES = [Role.Architect, Role.MasterAdmin] as const;

/** Roles that can earn affiliate commissions */
export const AFFILIATE_ROLES = [Role.Creator] as const;

/** All roles a user can self-select on registration */
export const SELF_REGISTER_ROLES = [
  Role.Customer,
  Role.Architect,
  Role.Creator,
  Role.Vendor,
  Role.Intern,
] as const;