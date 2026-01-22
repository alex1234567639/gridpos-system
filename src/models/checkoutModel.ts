export interface CheckoutRequest {
  grid: string;
  price: number;
  owner: string;
  operator: string;
}

export interface CheckoutResponse {
  success: boolean;
  txId: string;
}
