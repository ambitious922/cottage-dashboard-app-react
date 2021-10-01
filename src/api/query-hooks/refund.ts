import { GraphQLResult } from '@aws-amplify/api';
import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { GetRefundInput, RefundQuery } from 'API';
import { QueryKeys } from 'models/react-query';
import { createOrderRefundFn, getRefundFn } from 'api/query-functions/refund';

export const useGetRefund = (
  input: GetRefundInput,
  options: UseQueryOptions<GraphQLResult<RefundQuery>> = {}
) => {
  return useQuery<GraphQLResult<RefundQuery>>({
    queryKey: [QueryKeys.REFUND, input],
    queryFn: getRefundFn,
    ...options,
  });
};

export const useCreateOrderRefund = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createOrderRefundFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.CONSUMER);
      queryClient.invalidateQueries(QueryKeys.CONSUMER_TRANSACTIONS);
    },
    ...options,
  });
};
