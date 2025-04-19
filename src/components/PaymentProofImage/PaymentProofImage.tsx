"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { clientSupabase } from "~/server/supabase/supabaseClient";

interface PaymentProofImageProps {
  bucket: string;
  path: string;
  filename: string;
}

export function PaymentProofImage({ bucket, path, filename }: PaymentProofImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImage = async () => {
    try {
      console.log('Loading image with params:', { bucket, path, filename });
      setIsLoading(true);
      setError(null);

      // Primero intentamos obtener una URL pública
      const { data: publicUrl } = clientSupabase
        .storage
        .from(bucket)
        .getPublicUrl(path);

      if (publicUrl.publicUrl) {
        console.log('Got public URL:', publicUrl.publicUrl);
        setImageUrl(publicUrl.publicUrl);
        setIsLoading(false);
        return;
      }

      // Si no hay URL pública, intentamos descargar el archivo
      console.log('Attempting to download file...');
      const { data, error } = await clientSupabase
        .storage
        .from(bucket)
        .download(path);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      if (data) {
        console.log('File downloaded successfully, creating blob URL');
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      } else {
        console.log('No data received from download');
      }
    } catch (e) {
      console.error('Error in loadImage:', e);
      setError(e instanceof Error ? e.message : 'Error al cargar la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadImage();
    // Limpieza de URLs de blob al desmontar
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [bucket, path, filename]);

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-gray-50">
        <div className="text-sm text-gray-500">Cargando imagen...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-red-50">
        <div className="text-sm text-gray-500">Error: {error}</div>
        <div className="mt-2 text-xs text-gray-400">
          Bucket: {bucket}, Path: {path}
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-gray-50">
        <div className="text-sm text-gray-500">No se pudo cargar la imagen</div>
        <div className="mt-2 text-xs text-gray-400">
          Bucket: {bucket}, Path: {path}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg border">
      <Image
        src={imageUrl}
        alt={`Comprobante de pago - ${filename}`}
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  );
} 