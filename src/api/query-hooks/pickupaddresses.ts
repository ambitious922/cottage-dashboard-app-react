import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { MutationOptions, QueryKeys } from 'models/react-query';
import { ByIdInput, getLocationPickupAddressesQuery, PaginationInput } from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import {
  archivePickupAddressFn,
  createPickupAddressFn,
  getLocationPickupAddressesFn,
  updatePickupAddressFn,
} from 'api/query-functions/pickupaddress';

export const useGetLocationPickupAddresses = (
  input: ByIdInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getLocationPickupAddressesQuery>> = {}
) => {
  return useQuery<GraphQLResult<getLocationPickupAddressesQuery>>({
    queryKey: [QueryKeys.LOCATION_PICKUP_ADDRESSES, input, pagination],
    queryFn: getLocationPickupAddressesFn,
    ...options,
  });
};

export const useCreatePickupAddress = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createPickupAddressFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LOCATION_PICKUP_ADDRESSES);
    },
    ...options,
  });
};

export const useUpdatePickupAddress = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updatePickupAddressFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LOCATION_PICKUP_ADDRESSES);
    },
    ...options,
  });
};

export const useArchivePickupAddress = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(archivePickupAddressFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LOCATION_PICKUP_ADDRESSES);
    },
    ...options,
  });
};
