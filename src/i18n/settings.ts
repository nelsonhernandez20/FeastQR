import { type Namespace } from "i18next";

export const fallbackLng = "es" as const;
export const languages = [fallbackLng, "en", "pl"] as const;
export const defaultNamespace: Namespace = "common";
export type Language = (typeof languages)[number];

export function getOptions(
  lng: Language = fallbackLng,
  ns: Namespace = defaultNamespace,
) {
  return {
    supportedLngs: languages,
    fallbackLng: languages,
    lng,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
  };
}
