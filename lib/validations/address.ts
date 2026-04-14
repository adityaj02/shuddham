import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  line1: z.string().min(5),
  line2: z.string().optional().nullable(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2).default("India"),
  label: z.string().min(2).default("Home"),
  isDefault: z.coerce.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
