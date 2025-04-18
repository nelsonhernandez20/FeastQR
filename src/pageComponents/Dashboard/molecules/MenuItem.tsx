import { MenuOperations } from "./MenuOperations";
import Link from "next/link";
import { type menus as Menu } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface MenuItemProps {
  menu: Menu;
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
