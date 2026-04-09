import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().min(1, "Description is required"),
  colors: z.array(z.string()).min(1, "Select at least one color"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine((v) => {
      const n = Number(v);
      return !Number.isNaN(n) && n >= 0;
    }, "Price must be a valid number"),
  categoryId: z.string().trim().min(1, "Choose a category"),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\/.+/i.test(v),
      "Enter a valid http(s) URL or leave empty",
    ),
});
