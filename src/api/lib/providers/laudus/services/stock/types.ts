export interface LaudusStockProduct {
  productId: number;
  sku: string;
  stock: number;
}

export interface LaudusStockResponse {
  products: LaudusStockProduct[];
}
