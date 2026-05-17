import { z } from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2),
  subtitle: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  sku: z.string().min(3),
  price: z.coerce.number().min(1),
  compareAtPrice: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().int().min(0),
  image: z.string().min(1),
  isFeatured: z.coerce.boolean().optional().default(false),
  isActive: z.coerce.boolean().optional().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
