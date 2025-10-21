import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().refine((val) => val === "admin"),
  password: z.string().refine((val) => val === "admin"),
});
