import type commonMessages from "./pl/common";
import type zodMessages from "./pl/zod";

export type Resources = {
  common: typeof commonMessages & {
    notifications: {
      menuNotFound: string;
      subscriptionCancelled: string;
      subscriptionCancelledDescription: string;
      somethingWentWrong: string;
      tryAgainLater: string;
      newOrder: string;
    };
    sidebar: {
      menu: string;
      restaurant: string;
      QRMenu: string;
      notifications: string;
      edit: string;
    };
  };
  zod: typeof zodMessages;
};
