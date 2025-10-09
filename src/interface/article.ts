export interface IArticle {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    images: [string];
    price: number;
    quantity: number;
    createdAt: string;
    createdBy: number;
    modifiedAt: string;
    modifiedBy: number;
  } | null;
  title: string;
  body: string;
  tags: string[];
  enabled: true;
  published: true;
  publishedAt: string;
  showComment: true;
  createdAt: string;
  createdBy: number;
  modifiedAt: string;
  modifiedBy: number;
}
