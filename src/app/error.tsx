"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Navbar } from "~/components/Navbar/Navbar";
import { Button } from "~/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="-mt-6 flex grow items-center justify-center gap-4 bg-gray-100">
        <div className="flex h-full flex-col items-center justify-center gap-4 ">
          <h1 className="text-5xl font-bold text-gray-800">
            Ha Ocurrido un Error
          </h1>
          <p className="text-2xl font-medium text-gray-800">
            Nos disculpamos! Si el problema persiste, por favor contáctanos en
          </p>
          <p className="text-lg">support@feastqr.com</p>
          <div className="flex flex-row justify-between">
            <Button onClick={() => reset()}>Intentar de nuevo</Button>
          </div>
          <Link href="/" className="mt-4 text-xl underline">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </>
  );
}
