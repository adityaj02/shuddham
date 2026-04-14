import { demoCategories, demoProducts, demoReviews } from "@/lib/data/demo";
import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import type { Product, ProductFilters, Review } from "@/types";
import type { ProductInput } from "@/lib/validations/product";

const withCategory = (product: Product) => ({
  ...product,
  category: demoCategories.find((category) => category.id === product.categoryId) ?? null,
});

export const getCategories = async () => {
  if (!hasSupabaseEnv) return demoCategories;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return demoCategories;

  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data || data.length === 0) return demoCategories;
  return data;
};

export const getProducts = async (filters: ProductFilters = {}) => {
  if (!hasSupabaseEnv) {
    return demoProducts
      .filter((product) =>
        filters.category
          ? demoCategories.find((category) => category.id === product.categoryId)?.slug ===
            filters.category
          : true
      )
      .filter((product) => (filters.featured ? product.isFeatured : true))
      .filter((product) =>
        filters.search
          ? `${product.name} ${product.subtitle} ${product.tags.join(" ")}`
              .toLowerCase()
              .includes(filters.search.toLowerCase())
          : true
      )
      .map(withCategory);
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return demoProducts.map(withCategory);

  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters.featured) {
    query = query.eq("is_featured", true);
  }

  if (filters.category) {
    const categories = await getCategories();
    const category = categories.find((item) => item.slug === filters.category);
    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) return demoProducts.map(withCategory);

  return data.map((row: any) => ({
    id: row.id,
    categoryId: row.category_id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    shortDescription: row.short_description,
    description: row.description,
    sku: row.sku,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    currency: row.currency,
    stock: row.stock,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    images: row.images ?? [],
    tags: row.tags ?? [],
    certifications: row.certifications ?? [],
    nutritionHighlights: row.nutrition_highlights ?? [],
    rating: row.rating,
    reviewCount: row.review_count,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.categories,
  }));
};

export const getFeaturedProducts = async () => getProducts({ featured: true });

export const getProductBySlug = async (slug: string) => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
};

export const getRelatedProducts = async (product: Product) => {
  const category = demoCategories.find((item) => item.id === product.categoryId);
  const products = await getProducts({ category: category?.slug });
  return products.filter((item) => item.id !== product.id).slice(0, 3);
};

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  if (!hasSupabaseEnv) {
    return demoReviews.filter((review) => review.productId === productId);
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return demoReviews.filter((review) => review.productId === productId);

  const { data, error } = await supabase
    .from("reviews")
    .select("*, users!reviews_user_id_fkey(id, first_name, last_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoReviews.filter((review) => review.productId === productId);
  }

  return data.map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    rating: row.rating,
    verifiedPurchase: row.verified_purchase,
    createdAt: row.created_at,
    user: {
      id: row.users.id,
      firstName: row.users.first_name,
      lastName: row.users.last_name,
      avatarUrl: row.users.avatar_url,
    },
  }));
};

export const addReview = async (data: {
  productId: string;
  userId: string; // This is the Supabase auth_id (from auth.users)
  rating: number;
  title: string;
  body: string;
}) => {
  if (!hasSupabaseEnv) {
    console.log("[Products] Demo Mode: Review stored in memory (simulated)", data);
    return { success: true, mode: "demo" };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase not configured");

  // Map auth_id -> internal users.id (required by the reviews FK)
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", data.userId)
    .single();

  if (userError || !userRecord) {
    console.error("[Products] Could not find internal user for auth_id:", data.userId, userError);
    throw new Error("User profile not found. Please try signing out and back in.");
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: data.productId,
    user_id: userRecord.id, // Use internal users.id, not auth_id
    rating: data.rating,
    title: data.title,
    body: data.body,
    verified_purchase: false,
  });

  if (error) {
    console.error("[Products] Add Review error:", error);
    throw new Error(error.message);
  }

  return { success: true };
};

export const upsertProduct = async (input: ProductInput) => {
  const payload = {
    category_id: input.categoryId,
    slug: slugify(input.name),
    name: input.name,
    subtitle: input.subtitle,
    short_description: input.shortDescription,
    description: input.description,
    sku: input.sku,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    currency: "INR",
    stock: input.stock,
    is_featured: input.isFeatured ?? false,
    is_active: input.isActive ?? true,
    images: [input.image],
    tags: [],
    certifications: [],
    nutrition_highlights: [],
    rating: 0,
    review_count: 0,
    metadata: {},
  };

  if (!hasSupabaseEnv) {
    return {
      ...withCategory({
        id: input.id ?? `draft-${slugify(input.name)}`,
        categoryId: input.categoryId,
        slug: slugify(input.name),
        name: input.name,
        subtitle: input.subtitle,
        shortDescription: input.shortDescription,
        description: input.description,
        sku: input.sku,
        price: input.price,
        compareAtPrice: input.compareAtPrice ?? null,
        currency: "INR",
        stock: input.stock,
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
        images: [input.image],
        tags: [],
        certifications: [],
        nutritionHighlights: [],
        rating: 0,
        reviewCount: 0,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      mode: "demo",
    };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = input.id
    ? await supabase
        .from("products")
        .update(payload)
        .eq("id", input.id)
        .select()
        .single()
    : await supabase.from("products").insert(payload).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteProduct = async (id: string) => {
  if (!hasSupabaseEnv) return { success: true, mode: "demo" };

  const supabase = createSupabaseAdminClient();
  if (!supabase) return { success: false };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};
