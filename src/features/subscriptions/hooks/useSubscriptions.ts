import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

function useSubscription() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => authClient.customer.state(),
  });
}

export function useHasActiveSubscription() {
  const { data: customerState, isLoading, ...rest } = useSubscription();

  const hasActiveSubscription =
    customerState?.data?.activeSubscriptions &&
    customerState?.data?.activeSubscriptions?.length > 0;

  return {
    hasActiveSubscription,
    isLoading,
    customerState: customerState?.data,
    ...rest,
  };
}
