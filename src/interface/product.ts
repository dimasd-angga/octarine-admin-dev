export interface IProduct {
  id?: number;
  name: string;
  description: string;
  images?: string[];
  price: number;
  quantity: number;
  createdAt?: string;
  createdBy?: number;
  modifiedAt?: string;
  modifiedBy?: number;
  enabled: boolean;
  genderPreference: "MEN" | "WOMEN" | "";
  variants?: IVariant[];
}

export interface IVariant {
  id: number;
  productId: number;
  volume: number;
  price: number;
  image?: string;
  imageUrl?: string;
  enabled: boolean;
  createdAt?: string;
  createdById?: number;
  modifiedAt?: string | null;
  modifiedById?: number | null;
}
