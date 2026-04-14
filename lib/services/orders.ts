import { demoOrders, demoProducts } from "@/lib/data/demo";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { calculateCartTotals, generateOrderNumber } from "@/lib/utils";
import type { CartItem, Order } from "@/types";

const mapOrderRow = (row: any): Order => ({
  id: row.id,
  userId: row.user_id,
  addressId: row.address_id,
  orderNumber: row.order_number,
  status: row.status,
  paymentGateway: row.payment_gateway,
  paymentStatus: row.payment_status,
  subtotal: row.subtotal,
  shippingAmount: row.shipping_amount,
  discountAmount: row.discount_amount,
  taxAmount: row.tax_amount,
  totalAmount: row.total_amount,
  currency: row.currency,
  notes: row.notes,
  items: (row.order_items ?? []).map((item: any) => ({
    id: item.id,
    productId: item.product_id,
    orderId: item.order_id,
    productName: item.product_name,
    productSlug: item.product_slug,
    image: item.image,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    totalPrice: item.total_price,
  })),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getOrdersByUser = async (userId: string | null | undefined) => {
  if (!userId) return [];

  if (!hasSupabaseEnv) {
    return demoOrders.filter((order) => order.userId === userId);
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapOrderRow);
};

export const getAllOrders = async () => {
  if (!hasSupabaseEnv) return demoOrders;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapOrderRow);
};

export const createOrder = async ({
  userId,
  addressId,
  items,
  gateway,
  note,
}: {
  userId: string;
  addressId: string;
  items: CartItem[];
  gateway: "stripe" | "razorpay" | "cod";
  note?: string;
}) => {
  const totals = calculateCartTotals(items);

  if (!hasSupabaseEnv) {
    return {
      id: "order-pending-demo",
      orderNumber: generateOrderNumber(),
      status: "pending",
      paymentStatus: "pending",
      totalAmount: totals.totalAmount,
      gateway,
      paymentUrl: null,
      mode: "demo",
    };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const orderPayload = {
    user_id: userId,
    address_id: addressId,
    order_number: generateOrderNumber(),
    status: "pending",
    payment_gateway: gateway === "cod" ? "razorpay" : gateway, // Map 'cod' to 'razorpay' to avoid DB enum error
    payment_status: "pending",
    subtotal: totals.subtotal,
    shipping_amount: totals.shippingAmount,
    discount_amount: 0,
    tax_amount: totals.taxAmount,
    total_amount: totals.totalAmount,
    currency: "INR",
    notes: (note ?? "") + (gateway === "cod" ? "\n[System Note: Cash on Delivery]" : ""),
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const orderItemsPayload = items.map((item) => {
    const product = demoProducts.find((productRow) => productRow.id === item.productId);

    return {
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_slug: item.slug,
      image: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.quantity * item.price,
      product_snapshot: product ?? null,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
    totalAmount: order.total_amount,
    gateway: order.payment_gateway,
    paymentUrl: null,
  };
};

export const cancelOrder = async (orderId: string) => {
  if (!hasSupabaseEnv) return { success: true, mode: "demo" };

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase Admin Client not configured. Check service role key.");
  }

  // Allow cancellation of pending or paid orders
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    console.error("[Orders] Fetch for cancel failed:", fetchError);
    throw new Error("Order not found or inaccessible.");
  }

  const allowedStatuses = ["pending", "paid"];
  if (!allowedStatuses.includes(order.status)) {
    throw new Error(`Cannot cancel order in '${order.status}' status. Only pending or paid orders.`);
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("[Orders] Status update failed:", error);
    throw new Error(error.message);
  }

  console.log(`[Orders] Order ${orderId} cancelled successfully.`);
  return { success: true };
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  if (!hasSupabaseEnv) return { success: true, mode: "demo" };

  const supabase = createSupabaseAdminClient();
  if (!supabase) return { success: false };

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  if (!hasSupabaseEnv) {
    return demoOrders.find((order) => order.id === orderId) ?? null;
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (error || !data) return null;
  return mapOrderRow(data);
};
