export interface IVoucher {
  id?: number;
  code: string;
  name: string;
  description: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  enabled: boolean;
  createdAt?: string;
  modifiedAt?: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
}
