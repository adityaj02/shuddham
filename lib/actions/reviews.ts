"use server";

import { addReview as addReviewService } from "@/lib/services/products";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(data: {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
}) {
  try {
    const result = await addReviewService(data);
    revalidatePath(`/products/[slug]`, "page");
    return result;
  } catch (error) {
    console.error("[ReviewAction] Failed to submit review:", error);
    throw error;
  }
}
