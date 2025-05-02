import Image from "next/image";
import logoBumenuqr from "~/assets/bu-menu-logo.png";

export const FeastQRLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <Image src={logoBumenuqr} alt="Icon" height={80} />
      <span className="text-xl font-semibold">BuMenuQR</span>
    </div>
  );
};
