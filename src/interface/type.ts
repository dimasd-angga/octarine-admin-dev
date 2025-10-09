export interface IType {
  id: number;
  name: string;
  description?: string;
  enabled: boolean;
  createdAt?: string;
  modifiedAt?: string | null;
}
