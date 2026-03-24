import { z } from "zod";

export const ComboboxItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  data: z.unknown(),
});

export type ComboboxItem = z.infer<typeof ComboboxItemSchema>;
