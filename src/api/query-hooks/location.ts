import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MutationOptions, QueryKeys } from 'models/react-query';
import { archiveLocationFn, createLocationFn, getLocationFulfillmentFn, getLocationSettingsDataFn, updateLocationFn } from 'api/query-functions/location';
import { ArchiveLocationMutation, ByIdInput, getLocationFulfillmentQuery, getLocationSettingsQuery, LocationFulfillmentInput, UpdateLocationMutation } from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryOptions } from '@testing-library/react';

export const useGetLocationSettingsData = (input: ByIdInput, options: QueryOptions | any = {}) => {
  return useQuery<GraphQLResult<getLocationSettingsQuery>>({
    queryKey: [QueryKeys.LOCATION, input],
    queryFn: getLocationSettingsDataFn,
    ...options,
  })
}

export const useCreateLocation = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient()
  return useMutation(createLocationFn, {
    ...options,
      onSuccess: () => queryClient.invalidateQueries(QueryKeys.BUSINESS_LOCATIONS),
  });
};

export const useUpdateLocation = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateLocationFn, {
    ...options,
    onSuccess: (data: GraphQLResult<UpdateLocationMutation>) => 
      queryClient.invalidateQueries([QueryKeys.LOCATION, { id: data.data?.updateLocation?.location?.id }])
  });
};

export const useArchiveLocation = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(archiveLocationFn, {
    ...options,
    onSuccess: (data: GraphQLResult<ArchiveLocationMutation>) => 
      queryClient.invalidateQueries([QueryKeys.LOCATION, { id: data.data?.archiveLocation?.location?.id }])
  });
};

export const useGetLocationFullfillment = (
  input: ByIdInput, 
  fulfillmentInput: LocationFulfillmentInput, 
  options: QueryOptions | any = {}
  ) => {
    return useQuery<GraphQLResult<getLocationFulfillmentQuery>>({
      queryKey: [QueryKeys.LOCATION_FULFILLMENT, input, fulfillmentInput],
      queryFn: getLocationFulfillmentFn,
      ...options,
    })
};
