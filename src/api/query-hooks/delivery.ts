import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { MutationOptions, QueryKeys } from 'models/react-query';
import { ByIdInput, getLocationDeliveriesQuery, PaginationInput } from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import {
  archiveDeliveryFn,
  createDeliveryFn,
  getLocationDeliveriesFn,
  updateDeliveryFn,
} from 'api/query-functions/delivery';

export const useGetLocationDeliveries = (
  input: ByIdInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getLocationDeliveriesQuery>> = {}
) => {
  return useQuery<GraphQLResult<getLocationDeliveriesQuery>>({
    queryKey: [QueryKeys.LOCATION_DELIVERIES, input, pagination],
    queryFn: getLocationDeliveriesFn,
    ...options,
  });
};

export const useCreateDelivery = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createDeliveryFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LOCATION_DELIVERIES);
    },
    ...options,
  });
};

export const useUpdateDelivery = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateDeliveryFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LOCATION_DELIVERIES);
    },
    ...options,
  });
};

export const useArchiveDelivery = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(archiveDeliveryFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LOCATION_DELIVERIES);
    },
    ...options,
  });
};
