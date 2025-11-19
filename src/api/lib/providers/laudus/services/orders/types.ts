export interface OrderData {
  laudusCustomerId: string;
  shippingAddressId?: number;
  customerPaymentFormId: string;
  laudusSellerId: string;
  comments?: string;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  items: Array<{
    quantity: number;
    unitPrice: number;
    sku: string;
  }>;
}
