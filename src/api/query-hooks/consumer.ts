import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { MutationOptions, QueryKeys } from 'models/react-query';
import {
  FilterConsumersInput,
  PaginationInput,
  GetBusinessInput,
  getBusinessConsumersQuery,
  GetConsumerQuery,
  FilterTransactionInput,
  getConsumerTransactionsQuery,
  FilterSubscriptionsInput,
  getConsumerSubscriptionsQuery,
  GetConsumerInput,
} from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import {
  getBusinessConsumersFn,
  getConsumerTransactionsFn,
  getConsumerFn,
  updateConsumerStatusFn,
  getConsumerSubscriptionsFn,
  updateConsumerNoteFn,
} from 'api/query-functions/consumer';

export const useGetBusinessConsumers = (
  input: GetBusinessInput,
  filters: FilterConsumersInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getBusinessConsumersQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessConsumersQuery>>({
    queryKey: [QueryKeys.CONSUMER, input, filters, pagination],
    queryFn: getBusinessConsumersFn,
    ...options,
  });
};

export const useGetConsumerTransactions = (
  input: GetConsumerInput,
  filters: FilterTransactionInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getConsumerTransactionsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getConsumerTransactionsQuery>>({
    queryKey: [QueryKeys.CONSUMER_TRANSACTIONS, input, filters, pagination],
    queryFn: getConsumerTransactionsFn,
    ...options,
  });
};

export const useGetConsumerSubscriptions = (
  input: GetConsumerInput,
  filters: FilterSubscriptionsInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getConsumerSubscriptionsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getConsumerSubscriptionsQuery>>({
    queryKey: [QueryKeys.CONSUMER_SUBSCRIPTIONS, input, filters, pagination],
    queryFn: getConsumerSubscriptionsFn,
    ...options,
  });
};

export const useGetConsumer = (
  input: GetConsumerInput,
  options: UseQueryOptions<GraphQLResult<GetConsumerQuery>> = {}
) => {
  return useQuery<GraphQLResult<GetConsumerQuery>>({
    queryKey: [QueryKeys.CONSUMER, input],
    queryFn: getConsumerFn,
    ...options,
  });
};

export const useUpdateConsumerStatus = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateConsumerStatusFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.CONSUMER);
    },
    ...options,
  });
};

export const useUpdateConsumerNote = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateConsumerNoteFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.CONSUMER);
    },
    ...options,
  });
};
