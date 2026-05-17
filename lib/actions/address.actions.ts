"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { ensureUserRecord, upsertAddress } from "@/lib/services/users";
import { addressSchema } from "@/lib/validations/address";

export const saveAddressAction = async (formData: FormData) => {

  const session = await requireUser();
  const appUser = await ensureUserRecord(session.user);

  if (!appUser) {
    throw new Error("User record not found.");
  }

  const payload = addressSchema.parse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "India",
    label: formData.get("label") || "Home",
    isDefault: formData.get("isDefault") === "on",
  });

  await upsertAddress(appUser.id, payload);
  revalidatePath("/dashboard");
  revalidatePath("/checkout");
};
