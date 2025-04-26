"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { ImageUploadInput } from "~/components/ImageUploadInput/ImageUploadInput";
import { useForm } from "react-hook-form";
import { type FieldValues } from "react-hook-form";

import { getDefaultLanguage } from "~/utils/getDefaultLanguage";
import { type FullMenuOutput, parseDishes } from "~/utils/parseDishes";
import { useTranslation } from "react-i18next";
import {
  getCategoryTranslations,
  getDishVariantsTranslated,
} from "~/utils/categoriesUtils";
import { useInView } from "react-intersection-observer";
import { cn } from "~/utils/cn";
import { Badge } from "../ui/badge";
import { tagsTranslations } from "~/utils/tags";
import { notEmpty } from "~/utils/utils";
import { assert } from "~/utils/assert";
import { type TagType } from "@prisma/client";
import { api } from "~/trpc/react";
import { toast } from "react-hot-toast";

interface OrderFormData extends FieldValues {
  name: string;
  phone: string;
  locationInfo: string;
  additionalNotes: string;
  paymentProof?: File;
  email: string;
}

export const MainMenuView = ({ menu }: { menu: FullMenuOutput }) => {
  const defaultLanguageSet = useRef(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<Record<string, number>>(
    {},
  );
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const form = useForm<OrderFormData>();
  const { t } = useTranslation();
  const { data: restaurantInfo } = api.menus.getRestaurantInfo.useQuery({
    menuSlug: menu.slug,
  });
  const { data: userEmail } = api.menus.getUserEmailByMenuSlug.useQuery({
    menuSlug: menu.slug,
  });
  const sendOrderNotificationMutation =
    api.menus.sendOrderNotification.useMutation();

  const [email, setEmail] = useState(userEmail?.email ?? "");
  const defaultLanguage = getDefaultLanguage(menu.menuLanguages);

  if (!defaultLanguageSet.current) {
    setSelectedLanguage(defaultLanguage.languageId);
    defaultLanguageSet.current = true;
  }
  const parsedDishes = parseDishes(
    menu,
    selectedLanguage || defaultLanguage.languageId,
  );

  const handleQuantityChange = (dishId: string, change: number) => {
    setSelectedDishes((prev) => {
      const currentQuantity = prev[dishId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);

      if (newQuantity === 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [dishId]: newQuantity,
      };
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedDishes).reduce(
      (total, [dishId, quantity]) => {
        const dish = parsedDishes
          .flatMap(({ dishes }) => dishes)
          .find((d) => d.id === dishId);
        return total + (dish?.price || 0) * quantity;
      },
      0,
    );
  };

  const handleOrder = (withPayment: boolean) => {
    if (withPayment) {
      setShowPaymentDialog(true);
    } else {
      setShowOrderDialog(true);
    }
  };

  const uploadPaymentProofMutation =
    api.upload.uploadPaymentProof.useMutation();
  const createNotificationMutation =
    api.notifications.createNotification.useMutation();

  const handleSubmitOrder = async () => {
    try {
      // Create order details string
      const orderDetails = Object.entries(selectedDishes)
        .map(([dishId, quantity]) => {
          const dish = parsedDishes
            .flatMap(({ dishes }) => dishes)
            .find((d) => d.id === dishId);
          if (!dish) return null;
          return `${dish.name} x${quantity}\n${dish.price * quantity} USD`;
        })
        .filter(Boolean)
        .join(", ");

      if (paymentProof) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
          };
          reader.readAsDataURL(paymentProof);
        });

        const uploadResult = await uploadPaymentProofMutation.mutateAsync({
          file: base64,
          filename: paymentProof.name,
          menuSlug: menu.slug,
        });

        await createNotificationMutation.mutateAsync({
          menuSlug: menu.slug,
          customerName: form.getValues("name"),
          customerPhone: form.getValues("phone"),
          customerEmail: form.getValues("email"),
          title: orderDetails,
          description: orderDetails,
          type: "ORDER",
          locationInfo: form.getValues("locationInfo"),
          additionalNotes: form.getValues("additionalNotes"),
          paymentAmount: calculateTotal(),
          paymentCurrency: "USD",
          paymentDate: new Date(),
          paymentProofUrl: uploadResult.url,
        });
        await sendOrderNotificationMutation.mutateAsync({
          menuSlug: menu.slug,
          orderDetails,
          customerName: form.getValues("name"),
          customerPhone: form.getValues("phone"),
          locationInfo: form.getValues("locationInfo"),
          aditionalNotes: form.getValues("additionalNotes") ?? "",
          paymentAmount: calculateTotal(),
          paymentProofUrl: uploadResult.url,
        });
      } else {
        await createNotificationMutation.mutateAsync({
          menuSlug: menu.slug,
          customerName: form.getValues("name"),
          customerPhone: form.getValues("phone"),
          customerEmail: form.getValues("email"),
          title: orderDetails,
          description: orderDetails,
          type: "ORDER",
          locationInfo: form.getValues("locationInfo"),
          additionalNotes: form.getValues("additionalNotes"),
          paymentAmount: calculateTotal(),
          paymentCurrency: "USD",
          paymentDate: new Date(),
        });
        await sendOrderNotificationMutation.mutateAsync({
          menuSlug: menu.slug,
          orderDetails,
          customerName: form.getValues("name"),
          customerPhone: form.getValues("phone"),
          locationInfo: form.getValues("locationInfo"),
          aditionalNotes: form.getValues("additionalNotes") ?? "",
          paymentAmount: calculateTotal(),
          paymentProofUrl: null,
        });
      }

      setShowOrderDialog(false);
      setShowPaymentDialog(false);
      setPaymentProof(null);
      setSelectedDishes({});
      form.reset();
      toast.success(t("notifications.newOrder", "New order"));
    } catch (error) {
      console.error(error);
      toast.error(
        t("notifications.somethingWentWrong", "Something went wrong"),
      );
    }
  };

  return (
    <div className="z-0 flex h-full w-full bg-white ">
      <div className="flex w-full flex-col gap-5 ">
        <div className="relative aspect-[2/1] w-full">
          {menu.backgroundImageUrl && (
            <Image
              src={menu.backgroundImageUrl}
              fill
              alt="Background image"
              className="object-contain"
            />
          )}
        </div>
        <div className="flex w-full flex-row items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-bold md:text-4xl">{menu.name}</h1>
            <p className="md:text-regular text-sm text-slate-400">
              {menu?.address}, {menu.city}
            </p>
          </div>
        </div>
        {restaurantInfo?.info && (
          <div className="mx-2 rounded-lg border-[3px] border-green-400 px-4">
            <p className="font-semibold text-green-600">
              {restaurantInfo?.info ?? ""}
            </p>
          </div>
        )}
        <div className="sticky top-0 flex w-full flex-row items-center justify-between ">
          <CategoriesNavigation
            categories={parsedDishes
              .filter((category) => category.dishes.length > 0)
              .map(({ category }) => category)
              .filter(notEmpty)}
            languageId={selectedLanguage || defaultLanguage.languageId}
          />
        </div>

        <div className="flex flex-wrap gap-4 px-2">
          {parsedDishes?.map(({ category, dishes }) => {
            if (!dishes.length) return null;

            return (
              <div
                key={category?.id || "no-category"}
                className="w-full min-w-full flex-1"
                id={category?.id}
              >
                <div className="flex w-full flex-col gap-4">
                  {category?.name && (
                    <h3 className="w-full px-2 text-2xl font-extrabold">
                      {category?.name ?? ""}
                    </h3>
                  )}
                  <ul className="flex flex-wrap gap-2 px-2">
                    {dishes.map((dish) => {
                      const translatedTags = dish.dishesTag.map(
                        ({ tagName }) => {
                          const translationKey =
                            tagsTranslations[tagName as TagType];
                          return translationKey
                            ? t(translationKey, tagName)
                            : tagName;
                        },
                      ) as string[];

                      return (
                        <li
                          key={dish.id}
                          className="flex w-full flex-col items-start justify-between gap-2 "
                        >
                          <div className="flex w-full justify-between">
                            <div>
                              <div className="flex flex-col">
                                <h4 className="text-lg font-medium">
                                  {dish.name}
                                </h4>
                                <PriceCard price={dish.price} />
                              </div>
                              <div className="gap-2 text-slate-800">
                                <MacroCard
                                  protein={dish.protein}
                                  carbohydrates={dish.carbohydrates}
                                  fat={dish.fats}
                                  calories={dish.calories}
                                />
                              </div>
                              <p className="pt-1 text-sm text-slate-500">
                                {dish.description}
                              </p>
                              <Tags tags={translatedTags} />
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(dish.id, -1)
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <span className="min-w-[2rem] text-center">
                                  {selectedDishes[dish.id] || 0}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(dish.id, 1)
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {dish.pictureUrl && (
                              <Image
                                src={dish.pictureUrl}
                                alt={dish.name}
                                width={200}
                                height={200}
                                className="h-[100px] min-h-[100px] w-[100px] min-w-[100px] overflow-hidden rounded-xl object-cover"
                              />
                            )}
                          </div>
                          <div className="w-full">
                            <div className="relative flex w-full flex-col gap-3">
                              {getDishVariantsTranslated({
                                dishVariants: dish.dishVariants,
                                languageId:
                                  selectedLanguage ||
                                  defaultLanguage.languageId,
                              }).map((variant) => {
                                return (
                                  <VariantCard
                                    key={variant.id}
                                    name={variant.name || ""}
                                    price={variant.price}
                                    description={variant.description || ""}
                                  />
                                );
                              })}
                            </div>
                            <hr className="w-full" />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        {Object.keys(selectedDishes).length > 0 && (
          <div className="sticky bottom-0 flex w-full justify-center gap-4 bg-white p-4 shadow-lg">
            <button
              onClick={() => handleOrder(false)}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Ordenar
            </button>
            <button
              onClick={() => handleOrder(true)}
              className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600"
            >
              Ordenar y Pagar
            </button>
          </div>
        )}

        {/* Order Dialog */}
        <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Pedido</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmitOrder)}
              className="grid gap-4 py-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...form.register("name", { required: true })}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  {...form.register("phone", { required: true })}
                  placeholder="Tu teléfono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="locationInfo">Ubicación</Label>
                <Input
                  id="locationInfo"
                  {...form.register("locationInfo", { required: true })}
                  placeholder="Mesa 1, Delivery, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additionalNotes">Notas Adicionales</Label>
                <Input
                  id="additionalNotes"
                  {...form.register("additionalNotes")}
                  placeholder="Instrucciones especiales, alergias, etc."
                />
              </div>
              <div className="mt-4">
                <h4 className="mb-2 font-semibold">Platos Seleccionados:</h4>
                <div className="max-h-[200px] overflow-y-auto">
                  {Object.entries(selectedDishes).map(([dishId, quantity]) => {
                    const dish = parsedDishes
                      .flatMap(({ dishes }) => dishes)
                      .find((d) => d.id === dishId);
                    if (!dish) return null;
                    return (
                      <div key={dishId} className="flex justify-between py-1">
                        <span>
                          {dish.name} x{quantity}
                        </span>
                        <span>{(dish.price * quantity) / 100} USD</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{calculateTotal() / 100} USD</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Confirmar Pedido</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ordenar y Pagar</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmitOrder)}
              className="grid gap-4 py-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...form.register("name", { required: true })}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  {...form.register("phone", { required: true })}
                  placeholder="Tu teléfono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="locationInfo">Ubicación</Label>
                <Input
                  id="locationInfo"
                  {...form.register("locationInfo", { required: true })}
                  placeholder="Mesa 1, Delivery, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additionalNotes">Notas Adicionales</Label>
                <Input
                  id="additionalNotes"
                  {...form.register("additionalNotes")}
                  placeholder="Instrucciones especiales, alergias, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label>Comprobante de Pago</Label>
                <div className="rounded-lg border-2 border-dashed p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPaymentProof(file);
                      }
                    }}
                    className="w-full"
                  />
                  {paymentProof && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">
                        Archivo seleccionado: {paymentProof.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-2 font-semibold">Platos Seleccionados:</h4>
                <div className="max-h-[200px] overflow-y-auto">
                  {Object.entries(selectedDishes).map(([dishId, quantity]) => {
                    const dish = parsedDishes
                      .flatMap(({ dishes }) => dishes)
                      .find((d) => d.id === dishId);
                    if (!dish) return null;
                    return (
                      <div key={dishId} className="flex justify-between py-1">
                        <span>
                          {dish.name} x{quantity}
                        </span>
                        <span>{(dish.price * quantity) / 100} USD</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{calculateTotal() / 100} USD</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!paymentProof}>
                  Confirmar Pedido y Pago
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const Tags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row flex-wrap gap-2 py-1">
      {tags.map((tag, index) => (
        <Badge variant="secondary" key={index}>
          {tag}
        </Badge>
      ))}
    </div>
  );
};

const PriceCard = ({ price }: { price: number }) => {
  return (
    <div className="flex gap-1">
      <div className="text-sm">{price / 100}</div>
      <span className="text-[9px]">USD</span>
    </div>
  );
};

const NAVIGATION_HEIGHT = 40;

const CategoriesNavigation = ({
  categories,
  languageId,
}: {
  categories: FullMenuOutput["categories"];
  languageId: string;
}) => {
  const [visibleSetionsIds, setVisibleSetionsIds] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    slider.addEventListener("mousedown", onMouseDown);

    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    slider.addEventListener("mouseleave", onMouseLeave);

    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    slider.addEventListener("mouseup", onMouseUp);

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3;

      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousemove", onMouseMove);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      className="z-10 flex  w-screen max-w-3xl overflow-auto border-b-4 border-b-slate-200 bg-white scrollbar-none"
      ref={sliderRef}
      style={{ height: NAVIGATION_HEIGHT }}
    >
      {categories.map((category) => (
        <SingleCategory
          onVisibilityChange={(isVisible) => {
            setVisibleSetionsIds((prevVisibleSectionsIds) => {
              let newVisibleSectionIds = [...prevVisibleSectionsIds];

              if (isVisible)
                newVisibleSectionIds = [...prevVisibleSectionsIds, category.id];
              if (!isVisible)
                newVisibleSectionIds = prevVisibleSectionsIds.filter(
                  (id) => id !== category.id,
                );

              if (
                category.id ===
                newVisibleSectionIds[newVisibleSectionIds.length - 1]
              ) {
                const element = document.getElementById(`${category.id}-nav`);

                assert(!!element, "Element should exist");
                const elementOffsetLeft = element?.offsetLeft - 30;

                assert(!!sliderRef.current, "Slider should exist");
                sliderRef.current.scrollTo({
                  left: elementOffsetLeft,
                  behavior: "smooth",
                });
              }

              return newVisibleSectionIds;
            });
          }}
          isLastVisibleSection={
            category.id === visibleSetionsIds?.[visibleSetionsIds.length - 1]
          }
          key={category.id}
          languageId={languageId}
          category={category}
        />
      ))}
    </div>
  );
};

const VariantCard = ({
  description,
  name,
  price,
}: {
  name: string;
  price: number | null;
  description: string | null;
}) => {
  return (
    <div className="flex w-full flex-col pl-4 last:pb-2">
      <div className="align flex w-full justify-between">
        <h4 className="text-sm font-medium ">{name}</h4>
        {price && <PriceCard price={price} />}
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
};

const MacroCard = ({
  carbohydrates,
  fat,
  calories,
  protein,
}: {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
}) => {
  return (
    <div className="flex items-end gap-1 text-xs">
      {calories && <p>Kcal: {calories}</p>}
      {protein && <p>P: {protein}</p>}
      {carbohydrates && <p>C: {carbohydrates}</p>}
      {fat && <p>F: {fat}</p>}
    </div>
  );
};

const SingleCategory = ({
  category,
  languageId,
  isLastVisibleSection,
  onVisibilityChange,
}: {
  category: FullMenuOutput["categories"][number];
  languageId: string;
  isLastVisibleSection: boolean;
  onVisibilityChange: (isVisible: boolean) => void;
}) => {
  const translatedCategory = getCategoryTranslations({ category, languageId });
  const { ref, inView } = useInView({
    onChange(_inView) {
      onVisibilityChange(_inView);
    },
  });
  const navigateToCategory = useCallback(() => {
    const element = document.getElementById(category.id);

    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const finalScrollPosition = absoluteElementTop - NAVIGATION_HEIGHT - 20;

      window.scrollTo({
        top: finalScrollPosition,
        behavior: "smooth",
      });
    }
  }, [category.id]);

  useEffect(() => {
    ref(document.getElementById(category.id));
  }, [category.id, ref]);

  return (
    <div
      onClick={navigateToCategory}
      className={cn(
        "whitespace-nowrap   bg-white px-4 py-2 text-sm font-medium  text-slate-500 hover:cursor-pointer",
        inView && isLastVisibleSection && "bg-slate-200 text-black",
      )}
      id={`${category.id}-nav`}
    >
      {translatedCategory}
    </div>
  );
};
