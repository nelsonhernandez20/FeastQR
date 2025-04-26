import { TailwindIndicator } from "~/components/TailwindIndicator";
import { detectLanguage, useServerTranslation } from "~/i18n";
import { Providers } from "~/providers";
import "~/styles/globals.css";
import { cn } from "~/utils/cn";
import { Roboto } from "next/font/google";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";
import { headers } from "next/headers";
import { getServerUser } from "~/utils/auth";
import { AuthProvider } from "~/providers/AuthProvider/AuthProvider";
import { type Metadata } from "next";

export async function generateMetadata() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useServerTranslation();

  return {
    title: "Menú en Línea para tu Restaurante",
    description: "Crea y personaliza menús en línea y genera tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos.",
    keywords: ("menú, restaurante, en línea, QR, pedidos, comida, restaurantes, restaurante, gastronomía" as string).split(","),
    category: "restaurant menu builder",
    metadataBase: new URL("https://www.feastqr.com/"),
    openGraph: {
      type: "website",
      locale: "Menú en Línea para tu Restaurante",
      title: "Menú en Línea para tu Restaurante",
      url: "https://www.feastqr.com/",
      description: "Crea y personaliza menús en línea y genera tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos.",
      siteName: "FeastQR - crea tu menú en línea",
    },
    robots: {
      follow: true,
      index: true,
    },
    twitter: {
      card: "summary_large_image",
      title: "#",
      description: "Crea y personaliza menús en línea y genera tus propios códigos QR para brindar a tus clientes comodidad y pedidos rápidos.",
      site: "@feastqr",
    },
  } satisfies Metadata;
}

const font = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLanguage = detectLanguage(); // Detect on server, pass to client

  const user = await getServerUser();

  return (
    <>
      <html lang={initialLanguage}>
        <head />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            font.className,
          )}
        >
          <TRPCReactProvider headers={headers()}>
            <AuthProvider {...user}>
              <Providers initialLanugage={initialLanguage}>
                <div className="flex min-h-screen flex-col gap-6">
                  {children}
                  <TailwindIndicator />
                </div>
                <Toaster />
              </Providers>
            </AuthProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </>
  );
}

export default RootLayout;
