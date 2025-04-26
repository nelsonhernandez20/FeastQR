import { MenuOperations } from "./MenuOperations";
import Link from "next/link";
import { type menus } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

// Define the transformed menu type based on the getMenus function
interface TransformedMenu extends menus {
  logoImageUrl: string | null;
  backgroundImageUrl: string | null;
  contactNumber: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  googleReviewUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  slug: string;
  address: string;
}

interface MenuItemProps {
  menu: TransformedMenu;
}

export function MenuItem({ menu }: MenuItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex w-full flex-row  justify-between p-4">
      <div className="flex flex-row gap-4">
        <div className="relative aspect-[2/1] h-full">
          {menu.logoImageUrl && !imageError ? (
            <Image
              src={menu.logoImageUrl}
              fill
              alt="Background image"
              className="rounded-sm object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-sm bg-gray-200">
              <span className="text-sm text-gray-500">{menu.name[0]}</span>
            </div>
          )}
        </div>
        <Link href={`/menu/manage/${menu.slug}/restaurant`}>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col whitespace-nowrap">
              <p className="whitespace-nowrap font-semibold">{menu.name}</p>
              <p>{menu.address}</p>
            </div>
          </div>
        </Link>
      </div>
      <MenuOperations menuId={menu.id} />
    </div>
  );
}
