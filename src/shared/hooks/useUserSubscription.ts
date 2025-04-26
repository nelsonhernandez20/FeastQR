import { api } from "~/trpc/react";

export const checkIfSubscribed = (status?: string) => {
  return (
    status === "active" ||
    status === "cancelled" ||
    status === "on_trial" ||
    status === "past_due"
  );
};

export const useUserSubscription = () => {
  const { data, isLoading, refetch } = api.payments.getSubscriptionInfo.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  const status = data?.status;
  const isSubscribed = checkIfSubscribed(status);

  return {
    subscriptionData: data,
    isSubscriptionLoading: isLoading,
    isSubscribed,
    refetch,
  };
};
