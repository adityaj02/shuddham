import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  value: number,
  currency: "INR" | "USD" = "INR"
) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateOrderNumber = () =>
  `OG-${new Date().getFullYear()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

export const safeJsonParse = <T>(value: string | null, fallback: T) => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const calculateCartTotals = (
  items: { price: number; quantity: number }[]
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingAmount = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const taxAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + shippingAmount + taxAmount;

  return { subtotal, shippingAmount, taxAmount, totalAmount };
};

export const getInitials = (
  firstName?: string | null,
  lastName?: string | null
) => `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "OG";
