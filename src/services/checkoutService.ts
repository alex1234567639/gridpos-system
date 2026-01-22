import { CheckoutRequest, CheckoutResponse } from "@/models/checkoutModel";

export class CheckoutService {
  /** 結帳 - 呼叫 Apps Script */
  static async checkout(params: CheckoutRequest): Promise<CheckoutResponse> {
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const queryParams = new URLSearchParams({
      action: "checkout",
      gridNo: params.grid,
      price: params.price.toString(),
      ownerId: params.owner,
      operator: params.operator,
    });

    const url = `${apiUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors", // 明確指定 CORS 模式
        cache: "no-cache",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success && data.error) {
        throw new Error(data.error);
      }

      return data as CheckoutResponse;
    } catch (error: any) {
      console.error("Checkout error:", error);
      throw new Error(error.message || "結帳失敗，請稍後再試");
    }
  }
}
