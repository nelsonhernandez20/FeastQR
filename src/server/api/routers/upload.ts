import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const uploadSchema = z.object({
  file: z.string(), // base64 string
  filename: z.string(),
  menuSlug: z.string(),
});

export const uploadRouter = createTRPCRouter({
  uploadPaymentProof: publicProcedure
    .input(uploadSchema)
    .mutation(async ({ input }) => {
      const { file, filename, menuSlug } = input;
      
      // Convertir base64 a buffer
      const base64Data = file.split(",")[1] ?? "";
      const buffer = Buffer.from(base64Data, "base64");
      
      // Generar un path único para el archivo
      const path = `${menuSlug}/${Date.now()}-${filename}`;
      
      // Subir a Supabase
      const { data, error } = await supabase.storage
        .from("payment_proofs")
        .upload(path, buffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) throw error;

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("payment_proofs")
        .getPublicUrl(path);

      return {
        url: publicUrl,
        path,
        filename,
        bucket: "payment_proofs",
      };
    }),
}); 