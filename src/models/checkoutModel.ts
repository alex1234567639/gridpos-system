export interface CheckoutRequest {
  grid: string;
  price: number;
  operator: string;
}

export interface CheckoutResponse {
  success: boolean;
  txId: string;
}
