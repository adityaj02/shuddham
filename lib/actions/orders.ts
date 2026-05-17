"use server";

import { cancelOrder } from "@/lib/services/orders";
import { revalidatePath } from "next/cache";

export async function cancelOrderAction(orderId: string) {
  try {
    const result = await cancelOrder(orderId);
    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    console.error("[CancelOrderAction] Failed:", error);
    throw error;
  }
}
