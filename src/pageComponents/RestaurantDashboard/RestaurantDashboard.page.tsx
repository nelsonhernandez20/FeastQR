import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Icons } from "~/components/Icons";
import { LoadingScreen } from "~/components/Loading";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { DefaultLanguagesSelector } from "./molecules/DefaultLanguageSelector/DefaultLanguageSelector";
import { getDefaultLanguage } from "~/utils/getDefaultLanguage";
import { LanguagesSelector } from "./molecules/LanguagesSelector/LanguagesSelector";
import { useTranslation } from "react-i18next";
import { useUserSubscription } from "~/shared/hooks/useUserSubscription";
import QRCode from "qrcode.react";
import { SocialMediaHandlesForm } from "./molecules/SocialMediaHandles/SocialMediaHandles";
import { type MenuWithProfile } from "~/types/menu";
import { useEffect, useState } from "react";

export const RestaurantDashboard = ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const { data, error, isLoading } = api.menus.getMenuBySlug.useQuery({ slug }) as {
    data: MenuWithProfile | undefined;
    error: unknown;
    isLoading: boolean;
  };
  const { toast } = useToast();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { mutateAsync: addRestaurantInfo, isLoading: isSaving } =
  api.menus.addRestaurantInfo.useMutation();
  const { isSubscribed, isSubscriptionLoading } = useUserSubscription();
  const {
    mutateAsync: createPremiumCheckout,
    isLoading: isCreatePremiumCheckoutLoading,
  } = api.payments.createPremiumCheckout.useMutation();
  const { data: restaurantInfo } = api.menus.getRestaurantInfo.useQuery({
    menuSlug: slug,
  });
  const { mutateAsync: publishMenu } = api.menus.publishMenu.useMutation();
  const { mutateAsync: unpublishMenu } = api.menus.unpublishMenu.useMutation();
  const [info, setInfo] = useState("");
  useEffect(() => {
    if (restaurantInfo?.info) {
      setInfo(restaurantInfo.info);
    }
  }, [restaurantInfo]);
  const handleTogglePublish = async () => {
    if (!data) return;

    if (data.isPublished) {
      await unpublishMenu({ menuId: data.id });
      toast({
        title: t("restaurantDashboard.menuUnpublishedNotification"),
        description: t(
          "restaurantDashboard.menuUnpublishedNotificationDescription",
        ),
      });
    } else {
      await publishMenu({ menuId: data.id });
      toast({
        title: t("restaurantDashboard.menuPublishedNotification"),
        description: t(
          "restaurantDashboard.menuPublishedNotificationDescription",
        ),
      });
    }
  };

  if (isLoading || isSubscriptionLoading) return <LoadingScreen />;

  if (error) {
    toast({
      title: "Error",
      description: t("restaurantDashboard.menuNotFound"),
      variant: "destructive",
    });
    redirect("/dashboard");
  }

  if (!data) {
    return null;
  }

 

  const handleSaveInfo = async () => {
    if (!data) return;

    try {
      await addRestaurantInfo({
        menuId: data.id,
        info,
      });
      toast({
        title: t("restaurantDashboard.infoSaved"),
        description: t("restaurantDashboard.infoSavedDescription"),
      });
    } catch (error) {
      toast({
        title: t("restaurantDashboard.errorSavingInfo"),
        description: t("restaurantDashboard.errorSavingInfoDescription"),
        variant: "destructive",
      });
    }
  };



  return (
    <div className="flex w-full max-w-3xl flex-col  gap-6">
      <div className="relative aspect-[2/1] h-[200px]">
        {data.backgroundImageUrl && (
          <Image
            src={data.backgroundImageUrl}
            fill
            alt="Background image"
            className=" rounded-lg object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-row gap-4">
          <div className="relative aspect-square h-full  ">
            {data.logoImageUrl && (
              <Image
                src={data.logoImageUrl}
                fill
                alt="Logo image"
                className="rounded-lg object-cover"
              />
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <h1 className="whitespace-nowrap text-3xl font-semibold">
              {data.name}
            </h1>
            <div className="flex flex-row gap-2">
              <Icons.map />
              <h3 className="text-md whitespace-nowrap">
                {data.city}, {data.address}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col  gap-2">
          <p className="text-center text-lg font-semibold text-primary">
            {t("restaurantDashboard.restaurant")}{" "}
            {data.isPublished
              ? t("restaurantDashboard.menuPublished")
              : t("restaurantDashboard.menuNotPublished")}
          </p>
          {isSubscribed ? (
            <Button
              size="lg"
              onClick={handleTogglePublish}
              variant={data.isPublished ? "destructive" : "default"}
            >
              {data.isPublished
                ? t("restaurantDashboard.unpublish")
                : t("restaurantDashboard.publish")}
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                const message = `Hola quisera saber sobre los planes disponibles`;
                const whatsappUrl = `https://wa.me/584247607637?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              {t("restaurantDashboard.upgradeAccount")}
            </Button>
          )}
        </div>
      </div>
      <hr />
      <div className="flex flex-col justify-evenly gap-4 md:flex-row">
        <Link href={`/menu/${data.slug}/preview`} target="_blank">
          <div className="flex flex-row items-center gap-2">
            <Icons.menuSquare />
            <p className="text-xl font-semibold">
              {t("restaurantDashboard.menuPreview")}
            </p>
          </div>
        </Link>
        <Link href={`/menu/manage/${slug}/menu`} target="_blank">
          <div className="flex flex-row items-center gap-2">
            <Icons.edit />
            <p className="text-xl font-semibold">
              {t("restaurantDashboard.manageMenu")}
            </p>
          </div>
        </Link>
      </div>
      <hr />
      <h2 className="text-xl font-semibold">
        {t("restaurantDashboard.restaurantInfo")}
      </h2>
      <div className="flex flex-col gap-4">
        <textarea
          className="w-full rounded-lg border border-gray-300 p-2 text-lg"
          rows={5}
          placeholder={t("restaurantDashboard.infoPlaceholder")}
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
        <Button
          onClick={handleSaveInfo}
          disabled={isSaving}
          className="self-end"
        >
          {isSaving
            ? t("restaurantDashboard.saving")
            : t("restaurantDashboard.saveInfo")}
        </Button>
      </div>
      <div className="flex w-full grow flex-col gap-8 md:flex-row md:gap-0">
        <div className="flex w-full shrink grow flex-col items-center justify-center gap-4 border-r-2 border-secondary">
          <p className="text-3xl font-semibold">
            {t("restaurantDashboard.yourQRCode")}
          </p>
          <div className="flex flex-col gap-4">
            <QRCode size={200} value={`${getBaseUrl()}/menu/${data.slug}`} />
            <Button
              onClick={() => router.push(`/menu/manage/${slug}/menu`)}
              className="w-full"
              variant="outline"
              size="lg"
            >
              {t("restaurantDashboard.manageMenu")}
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 px-4">
          <p className="text-center text-3xl font-semibold">
            {t("restaurantDashboard.settings")}
          </p>
          <div className="flex flex-col gap-4">
            <p className=" text-lg ">
              {t("restaurantDashboard.availableLanguages")}
            </p>
            <LanguagesSelector
              menuId={data.id}
              initialLanguages={data.menuLanguages.map(
                (lang) => lang.languageId,
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className=" text-lg ">
              {t("restaurantDashboard.defaultLanguage")}
            </p>
            <DefaultLanguagesSelector
              menuId={data.id}
              initialDefaultLanguage={
                getDefaultLanguage(data.menuLanguages).languageId
              }
            />
          </div>
          <SocialMediaHandlesForm
            menuId={data.id}
            defaultValues={{
              facebookUrl: data.facebookUrl ?? "",
              instagramUrl: data.instagramUrl ?? "",
              googleReviewUrl: data.googleReviewUrl ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
};
