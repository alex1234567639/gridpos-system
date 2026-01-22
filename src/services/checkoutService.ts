import { CheckoutRequest, CheckoutResponse } from "@/models/checkoutModel";
import { get } from "./api";

export class CheckoutService {
  /** 結帳 - 呼叫 Apps Script */
  static async checkout(params: CheckoutRequest): Promise<CheckoutResponse> {
    // 使用封裝好的 GET 請求
    const queryParams = {
      action: "checkout",
      gridNo: params.grid,
      price: params.price.toString(),
      ownerId: params.owner,
      operator: params.operator,
    };

    const res = await get<CheckoutResponse>("", queryParams);
    return res;
  }
}
