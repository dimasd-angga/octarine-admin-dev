// @interface/voucher.ts

export interface IVoucher {
  id: number;
  code: string;
  name: string;
  description: string;
  type: "PERCENTAGE" | "FIXED" | "OTHER";
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validFrom: string; // ISO datetime
  validUntil: string; // ISO datetime
  usageLimit: number;
  usedCount: number;
  restricted: boolean;
  assignedUserCount: number;
  deletedAt?: string | null;
  createdAt: string;
  createdBy: number;
  modifiedAt: string;
  modifiedBy: number;
}
