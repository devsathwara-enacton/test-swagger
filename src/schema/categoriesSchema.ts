import { z } from "zod";

export const categoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  bg_color: z.string(),
  sort_order: z.number(),
});

export const categoriesSchema = z.array(categoryItemSchema);

export const fetchCategoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    Categories: categoriesSchema,
  }),
  error: z.number(),
  msg: z.string().nullable(),
});
