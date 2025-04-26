import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

interface NotificationWithMenu {
  id: string;
  menuSlug: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  title: string;
  description: string;
  type: string;
  locationInfo: string;
  additionalNotes: string | null;
  paymentProofUrl: string | null;
  paymentProofFilename: string | null;
  paymentProofBucket: string | null;
  paymentProofPath: string | null;
  paymentAmount: number | null;
  paymentCurrency: string | null;
  paymentDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  menus: {
    id: string;
    name: string;
    userId: string;
    slug: string;
    backgroundImageUrl: string | null;
    city: string;
    address: string;
    isPublished: boolean;
    updatedAt: Date;
    createdAt: Date;
    contactNumber: string | null;
    facebookUrl: string | null;
    googleReviewUrl: string | null;
    instagramUrl: string | null;
    logoImageUrl: string | null;
  };
}

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

const markAsReadSchema = z.object({
  notificationId: z.string(),
});

export const notificationsRouter = createTRPCRouter({
  createNotification: publicProcedure
    .input(createNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const notification = await ctx.db.$queryRaw<NotificationWithMenu[]>`
          INSERT INTO "public"."notifications" (
            id,
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
            gen_random_uuid(),
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
          RETURNING 
            id,
            menu_slug as "menuSlug",
            customer_name as "customerName",
            customer_phone as "customerPhone",
            customer_email as "customerEmail",
            title,
            description,
            type,
            location_info as "locationInfo",
            additional_notes as "additionalNotes",
            payment_proof_url as "paymentProofUrl",
            payment_proof_filename as "paymentProofFilename",
            payment_proof_bucket as "paymentProofBucket",
            payment_proof_path as "paymentProofPath",
            payment_amount as "paymentAmount",
            payment_currency as "paymentCurrency",
            payment_date as "paymentDate",
            created_at as "createdAt",
            updated_at as "updatedAt",
            is_read as "isRead"
        `;

        if (!notification || notification.length === 0) {
          throw new Error('Failed to create notification');
        }

        return notification[0];
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating notification: ${error.message}`);
        }
        throw new Error('Unexpected error while creating notification');
      }
    }),

  getNotificationsByMenuSlug: publicProcedure
    .input(z.object({ menuSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const notifications = await ctx.db.$queryRaw<NotificationWithMenu[]>`
        SELECT 
          n.*,
          m.*,
          n.is_read as "isRead",
          n.menu_slug as "menuSlug",
          n.customer_name as "customerName",
          n.customer_phone as "customerPhone",
          n.customer_email as "customerEmail",
          n.location_info as "locationInfo",
          n.additional_notes as "additionalNotes",
          n.payment_proof_url as "paymentProofUrl",
          n.payment_proof_filename as "paymentProofFilename",
          n.payment_proof_bucket as "paymentProofBucket",
          n.payment_proof_path as "paymentProofPath",
          n.payment_amount as "paymentAmount",
          n.payment_currency as "paymentCurrency",
          n.payment_date as "paymentDate",
          n.id as "idNotification",
          n.created_at as "createdAt",
          n.updated_at as "updatedAt"
        FROM public.notifications n
        LEFT JOIN public.menus m ON n.menu_slug = m.slug
        WHERE n.menu_slug = ${input.menuSlug}
        ORDER BY n.created_at DESC NULLS LAST
      `;
      
      return notifications;
    }),

  markAsRead: publicProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$executeRaw`
        UPDATE public.notifications 
        SET is_read = true 
        WHERE id = ${input.notificationId}::uuid
      `;

      const notification = await ctx.db.$queryRaw<NotificationWithMenu[]>`
        SELECT 
          n.*,
          m.*,
          n.is_read as "isRead",
          n.menu_slug as "menuSlug",
          n.customer_name as "customerName",
          n.customer_phone as "customerPhone",
          n.customer_email as "customerEmail",
          n.location_info as "locationInfo",
          n.additional_notes as "additionalNotes",
          n.payment_proof_url as "paymentProofUrl",
          n.payment_proof_filename as "paymentProofFilename",
          n.payment_proof_bucket as "paymentProofBucket",
          n.payment_proof_path as "paymentProofPath",
          n.payment_amount as "paymentAmount",
          n.payment_currency as "paymentCurrency",
          n.payment_date as "paymentDate",
          n.created_at as "createdAt",
          n.updated_at as "updatedAt"
        FROM public.notifications n
        LEFT JOIN public.menus m ON n.menu_slug = m.slug
        WHERE n.id = ${input.notificationId}::uuid
        ORDER BY n.created_at DESC NULLS LAST
      `;

      return notification[0];
    }),

  markAllAsRead: publicProcedure
    .input(z.object({ menuSlug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$executeRaw`
        UPDATE public.notifications 
        SET is_read = true 
        WHERE menu_slug = ${input.menuSlug} 
        AND is_read = false
      `;

      const notifications = await ctx.db.$queryRaw<NotificationWithMenu[]>`
        SELECT 
          n.*,
          m.*,
          n.is_read as "isRead",
          n.menu_slug as "menuSlug",
          n.customer_name as "customerName",
          n.customer_phone as "customerPhone",
          n.customer_email as "customerEmail",
          n.location_info as "locationInfo",
          n.additional_notes as "additionalNotes",
          n.payment_proof_url as "paymentProofUrl",
          n.payment_proof_filename as "paymentProofFilename",
          n.payment_proof_bucket as "paymentProofBucket",
          n.payment_proof_path as "paymentProofPath",
          n.payment_amount as "paymentAmount",
          n.payment_currency as "paymentCurrency",
          n.payment_date as "paymentDate",
          n.created_at as "createdAt",
          n.updated_at as "updatedAt"
        FROM public.notifications n
        LEFT JOIN public.menus m ON n.menu_slug = m.slug
        WHERE n.menu_slug = ${input.menuSlug}
        ORDER BY n.created_at DESC NULLS LAST
      `;

      return notifications;
    }),

  deleteNotification: publicProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First check if the notification exists and get its details
        const notifications = await ctx.db.$queryRaw<NotificationWithMenu[]>`
          SELECT 
            n.id,
            n.menu_slug as "menuSlug",
            n.created_at as "createdAt"
          FROM public.notifications n
          WHERE n.id = ${input.notificationId}::uuid
        `;

        if (!notifications || notifications.length === 0) {
          throw new Error(`Notification with ID ${input.notificationId} not found. Please verify the ID is correct.`);
        }

        // If notification exists, proceed with deletion
        const result = await ctx.db.$executeRaw`
          DELETE FROM public.notifications 
          WHERE id = ${input.notificationId}::uuid
          RETURNING id
        `;

        if (!result) {
          throw new Error(`Failed to delete notification ${input.notificationId}. The notification exists but could not be deleted.`);
        }

        const deletedNotification = notifications[0];
        if (!deletedNotification) {
          throw new Error(`Unexpected error: Notification data not found after successful deletion`);
        }
        
        return { 
          success: true, 
          deletedId: input.notificationId,
          details: {
            menuSlug: deletedNotification.menuSlug,
            createdAt: deletedNotification.createdAt
          }
        };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('invalid input syntax for type uuid')) {
            throw new Error(`Invalid notification ID format: ${input.notificationId}. Expected a valid UUID.`);
          }
          throw error;
        }
        throw new Error(`Unexpected error while deleting notification: ${String(error)}`);
      }
    }),
}); 