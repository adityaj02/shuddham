export type CurrencyCode = "INR" | "USD";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentGateway = "stripe" | "razorpay" | "cod";

export type AppUser = {
  id: string;
  authId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: "customer" | "admin";
  defaultAddressId: string | null;
  cartSnapshot: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  currency: CurrencyCode;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  tags: string[];
  certifications: string[];
  nutritionHighlights: string[];
  rating: number;
  reviewCount: number;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
};

export type Address = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  title: string;
  body: string;
  rating: number;
  verifiedPurchase: boolean;
  createdAt: string;
  user: Pick<AppUser, "id" | "firstName" | "lastName" | "avatarUrl">;
};

export type OrderItem = {
  id: string;
  productId: string;
  orderId: string;
  productName: string;
  productSlug: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Order = {
  id: string;
  userId: string;
  addressId: string | null;
  orderNumber: string;
  status: OrderStatus;
  paymentGateway: PaymentGateway;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: CurrencyCode;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
export type ProductFilters = {
  category?: string;
  search?: string;
  featured?: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
};

export type CheckoutPayload = {
  items: CartItem[];
  addressId: string;
  gateway: PaymentGateway;
  couponCode?: string;
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
  meta?: Record<string, string | number | boolean | null>;
};
