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
  };
  zod: typeof zodMessages;
};
