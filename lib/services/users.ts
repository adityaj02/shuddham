import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Address, AppUser, CartItem } from "@/types";
import type { AddressInput } from "@/lib/validations/address";
import { User } from "@supabase/supabase-js";

const mapUserRow = (row: any): AppUser => ({
  id: row.id,
  authId: row.auth_id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  phone: row.phone,
  avatarUrl: row.avatar_url,
  role: row.role,
  defaultAddressId: row.default_address_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapAddressRow = (row: any): Address => ({
  id: row.id,
  userId: row.user_id,
  fullName: row.full_name,
  phone: row.phone,
  line1: row.line1,
  line2: row.line2,
  city: row.city,
  state: row.state,
  postalCode: row.postal_code,
  country: row.country,
  label: row.label,
  isDefault: row.is_default,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Syncs a Supabase Auth user with the public.users table.
 * Also logs the login event for audit tracking.
 */
export const syncSupabaseUser = async (supabaseUser: User) => {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const payload = {
    auth_id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    first_name: supabaseUser.user_metadata.full_name?.split(" ")[0] ?? supabaseUser.user_metadata.first_name ?? "",
    last_name: supabaseUser.user_metadata.full_name?.split(" ").slice(1).join(" ") ?? supabaseUser.user_metadata.last_name ?? "",
    avatar_url: supabaseUser.user_metadata.avatar_url ?? "",
  };

  const { data: user, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "auth_id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Production requirement: Log the login event
  await supabase.from("logins").insert({
    user_id: user.id,
    user_agent: "server-side",
  });

  return mapUserRow(user);
};

export const ensureUserRecord = async (supabaseUser: User | null) => {
  if (!supabaseUser) return null;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", supabaseUser.id)
    .single();

  if (error || !data) {
    return syncSupabaseUser(supabaseUser);
  }

  return mapUserRow(data);
};

export const getUserByAuthId = async (authId: string | null | undefined) => {
  if (!authId) return null;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .single();

  if (error || !data) return null;
  return mapUserRow(data);
};

export const getUserById = async (userId: string | null | undefined) => {
  if (!userId) return null;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return mapUserRow(data);
};

export const updateUserProfile = async (
  authId: string, 
  data: { firstName: string; lastName: string; phone: string }
) => {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data: updated, error } = await supabase
    .from("users")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
    })
    .eq("auth_id", authId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapUserRow(updated);
};

export const getUserAddresses = async (userId: string | null | undefined) => {
  if (!userId) return [];

  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error || !data) return [];
  return data.map(mapAddressRow);
};

export const upsertAddress = async (userId: string, input: AddressInput) => {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const payload = {
    user_id: userId,
    full_name: input.fullName,
    phone: input.phone,
    line1: input.line1,
    line2: input.line2 ?? null,
    city: input.city,
    state: input.state,
    postal_code: input.postalCode,
    country: input.country,
    label: input.label,
    is_default: input.isDefault ?? false,
  };

  const query = input.id
    ? supabase.from("addresses").update(payload).eq("id", input.id)
    : supabase.from("addresses").insert(payload);

  const { data, error } = await query.select().single();
  if (error) {
    throw new Error(error.message);
  }

  if (input.isDefault) {
    await supabase
      .from("users")
      .update({ default_address_id: data.id })
      .eq("id", userId);
  }

  return mapAddressRow(data);
};

export const getCartSnapshot = async (authId: string | null | undefined): Promise<CartItem[]> => {
  if (!authId) return [];
  const user = await getUserByAuthId(authId);
  if (!user) return [];

  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("carts")
    .select(`
      id,
      cart_items (
        id,
        quantity,
        products (
          id,
          slug,
          name,
          primary_image,
          price,
          stock
        )
      )
    `)
    .eq("user_id", user.id)
    .single();

  if (error || !data || !data.cart_items) return [];

  return data.cart_items.map((item: any) => ({
    id: item.id,
    cartId: data.id,
    productId: item.products.id,
    slug: item.products.slug,
    name: item.products.name,
    image: item.products.primary_image || "",
    price: item.products.price,
    quantity: item.quantity,
    stock: item.products.stock,
  }));
};

export const syncCartSnapshot = async (authId: string, items: CartItem[]) => {
  const user = await getUserByAuthId(authId);
  if (!user) return items;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return items;

  // Get or create cart
  let { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).single();
  
  if (!cart) {
    const { data: newCart, error } = await supabase.from("carts").insert({ user_id: user.id }).select("id").single();
    if (error || !newCart) throw new Error(error?.message || "Failed to create cart");
    cart = newCart;
  }

  if (!cart) throw new Error("Cart not found");

  // Replace items
  await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  
  if (items.length > 0) {
    const cartItemsData = items.map(item => ({
      cart_id: cart.id,
      product_id: item.productId,
      quantity: item.quantity
    }));
    const { error } = await supabase.from("cart_items").insert(cartItemsData);
    if (error) throw new Error(error.message);
  }

  return items;
};
