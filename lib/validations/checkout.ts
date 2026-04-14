import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
  price: z.coerce.number().min(1),
  quantity: z.coerce.number().int().min(1),
  stock: z.coerce.number().int().min(0),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty"),
  addressId: z.string().min(1),
  gateway: z.enum(["cod"]),
  couponCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
