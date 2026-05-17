import { createOrder, getOrderById } from "@/lib/services/orders";
import { hasStripeEnv, hasRazorpayEnv } from "@/lib/env";
import { wait } from "@/lib/utils";
import { sendOrderAdminNotification, sendOrderCustomerConfirmation } from "@/lib/services/email";
import { getUserByAuthId, getUserById } from "@/lib/services/users";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CheckoutInput } from "@/lib/validations/checkout";
import type { Address } from "@/types";

// Fetch address by ID from Supabase
const getAddressById = async (addressId: string): Promise<Address | null> => {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    fullName: data.full_name,
    phone: data.phone,
    line1: data.line1,
    line2: data.line2,
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    country: data.country,
    label: data.label,
    isDefault: data.is_default,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const initializeCheckout = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: any;
}) => {
  const order = await createOrder({
    userId,
    addressId: payload.addressId,
    items: payload.items,
    gateway: payload.gateway,
  });

  if (!order) {
    throw new Error("Unable to initialize order.");
  }

  // ─── Email notifications ────────────────────────────
  // We must await in serverless environments otherwise the process terminates.
  try {
    const [fullOrder, address, customer] = await Promise.all([
      getOrderById(order.id),
      getAddressById(payload.addressId),
      getUserById(userId),
    ]);

    if (fullOrder) {
      await Promise.allSettled([
        sendOrderAdminNotification({ order: fullOrder, address, customer }),
        sendOrderCustomerConfirmation({ order: fullOrder, address, customer }),
      ]);
    }
  } catch (emailErr) {
    console.error("[Checkout] Email notification error:", emailErr);
  }

  const gatewayConfigured =
    payload.gateway === "cod" ||
    (payload.gateway === "stripe" && hasStripeEnv) ||
    (payload.gateway === "razorpay" && hasRazorpayEnv);

  if (!gatewayConfigured) {
    return {
      status: "pending_configuration",
      order,
      payment: {
        gateway: payload.gateway,
        message:
          payload.gateway === "stripe"
            ? "Stripe keys are not configured yet."
            : "Razorpay keys are not configured yet.",
      },
    };
  }

  await wait(150);

  return {
    status: "initialized",
    order,
    payment: {
      gateway: payload.gateway,
      clientSecret: null,
      redirectUrl: payload.gateway === "cod" ? `/dashboard?order=${order.id}&status=confirmed` : `/dashboard?order=${order.id}`,
    },
  };
};

export const verifyCheckout = async ({
  orderId,
  gateway,
  paymentId,
}: {
  orderId: string;
  gateway: "stripe" | "razorpay";
  paymentId: string;
}) => ({
  status: "verification_stub",
  orderId,
  gateway,
  paymentId,
  verified: false,
  message:
    "Payment verification is scaffolded and will be completed when live gateway keys are added.",
});
