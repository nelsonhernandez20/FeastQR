import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

const createNotificationSchema = z.object({
  menuSlug: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().optional(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  locationInfo: z.string(),
  additionalNotes: z.string().optional(),
  paymentProofUrl: z.string().optional(),
  paymentProofFilename: z.string().optional(),
  paymentProofBucket: z.string().optional(),
  paymentProofPath: z.string().optional(),
  paymentAmount: z.number().optional(),
  paymentCurrency: z.string().optional(),
  paymentDate: z.date().optional(),
});

export const notificationsRouter = createTRPCRouter({
  createNotification: publicProcedure
    .input(createNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$queryRaw`
        INSERT INTO "public"."notifications" (
          menu_slug,
          customer_name,
          customer_phone,
          customer_email,
          title,
          description,
          type,
          location_info,
          additional_notes,
          payment_proof_url,
          payment_proof_filename,
          payment_proof_bucket,
          payment_proof_path,
          payment_amount,
          payment_currency,
          payment_date
        ) VALUES (
          ${input.menuSlug},
          ${input.customerName},
          ${input.customerPhone},
          ${input.customerEmail},
          ${input.title},
          ${input.description},
          ${input.type},
          ${input.locationInfo},
          ${input.additionalNotes},
          ${input.paymentProofUrl},
          ${input.paymentProofFilename},
          ${input.paymentProofBucket},
          ${input.paymentProofPath},
          ${input.paymentAmount},
          ${input.paymentCurrency},
          ${input.paymentDate}
        )
        RETURNING *;
      `;
    }),
}); 