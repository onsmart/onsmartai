import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { sendContactLeadEmail } from "./contact/email";

const contactInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(8).max(25),
  company: z.string().trim().min(2).max(120),
  interest: z.string().trim().min(1).max(80),
  message: z.string().trim().max(1000).optional(),
});

export const contactRouter = router({
  submit: publicProcedure.input(contactInput).mutation(async ({ input }) => {
    try {
      await sendContactLeadEmail(input);
    } catch (error) {
      console.error("[Contact] Failed to send lead email:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível enviar sua mensagem.",
      });
    }
    return { success: true as const };
  }),
});
