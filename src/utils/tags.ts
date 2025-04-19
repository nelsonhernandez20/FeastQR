import { TagType } from "@prisma/client";
import { type ParseKeys } from "i18next";

export const tagsTranslations: Record<TagType, string> = {
  [TagType.keto]: 'tags.keto',
  [TagType.vegan]: 'tags.vegan',
  [TagType.vegetarian]: 'tags.vegetarian',
  [TagType.low_carb]: 'tags.low_carb',
  [TagType.sugar_free]: 'tags.sugar_free',
  [TagType.low_fat]: 'tags.low_fat',
  [TagType.high_protein]: 'tags.high_protein',
  [TagType.high_fiber]: 'tags.high_fiber',
  [TagType.organic]: 'tags.organic',
  [TagType.gluten_free]: 'tags.gluten_free',
  [TagType.lactose_free]: 'tags.lactose_free',
};
