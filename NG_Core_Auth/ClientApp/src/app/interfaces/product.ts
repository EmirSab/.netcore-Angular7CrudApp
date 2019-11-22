export interface Product {
  // 45 ProductService | Product Interface ->product.service.ts
  // dodati promertije za product
  // prije toga kreirati servis za product i interface
  productId?: number;
  name: string;
  description: string;
  outOfStock: boolean;
  price: number;
  imageUrl: string;
}
