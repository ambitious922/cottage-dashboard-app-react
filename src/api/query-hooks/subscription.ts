import { useMutation, MutationOptions, useQueryClient } from 'react-query';
import { QueryKeys } from 'models/react-query';
import { cancelSubscriptionFn } from 'api/query-functions/subscription';

export const useCancelSubscription = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();

  return useMutation(cancelSubscriptionFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PLAN_SUBSCRIPTIONS);
    },
    ...options,
  });
};