"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminSession } from "@/lib/auth";
import { deleteProduct, upsertProduct } from "@/lib/services/products";
import { updateOrderStatus } from "@/lib/services/orders";
import { productSchema } from "@/lib/validations/product";

const ensureAdmin = async () => {
  const allowed = await isAdminSession();
  if (!allowed) redirect("/dashboard");
};

export const saveProductAction = async (formData: FormData) => {
  await ensureAdmin();

  const payload = productSchema.parse({
    id: formData.get("id") || undefined,
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    subtitle: formData.get("subtitle"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    sku: formData.get("sku"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || null,
    stock: formData.get("stock"),
    image: formData.get("image"),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
  });

  await upsertProduct(payload);
  revalidatePath("/admin");
  revalidatePath("/products");
};

export const deleteProductAction = async (formData: FormData) => {
  await ensureAdmin();

  const id = String(formData.get("productId"));
  await deleteProduct(id);
  revalidatePath("/admin");
  revalidatePath("/products");
};

export const updateOrderStatusAction = async (formData: FormData) => {
  await ensureAdmin();

  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status"));
  await updateOrderStatus(orderId, status);
  revalidatePath("/admin");
  revalidatePath("/dashboard");
};
