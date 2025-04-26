import { type ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";

export const TranslatedText = ({ id }: { id: ParseKeys | any }) => {
  const { t } = useTranslation();

  return <> {t(id)}</>;
};
