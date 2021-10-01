import { createCreditFn } from 'api/query-functions/credit';
import { QueryKeys } from 'models/react-query';
import { useMutation, MutationOptions, useQueryClient } from 'react-query';

export const useCreateCredit = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createCreditFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.CONSUMER);
      queryClient.invalidateQueries(QueryKeys.CONSUMER_TRANSACTIONS);
    },
    ...options,
  });
};
