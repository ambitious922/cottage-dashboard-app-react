import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import {
  createBusinessFn,
  getBusinessFn,
  updateBusinessFn,
  getBusinessSettingsQueryResponse,
  getBusinessSettingsDataFn,
  getBusinessLocationsFn,
  getBusinessLocationsOverviewFn,
} from 'api/query-functions/business';
import { MutationOptions, QueryKeys } from 'models/react-query';
import {
  FilterLocationsInput,
  GetBusinessInput,
  getBusinessLocationsOverviewQuery,
  getBusinessLocationsQuery,
  getBusinessQuery,
  LocationFulfillmentInput,
} from 'API';
import { GraphQLResult } from '@aws-amplify/api';

export const useGetBusinessMetadata = (
  input: GetBusinessInput,
  options: UseQueryOptions<GraphQLResult<getBusinessQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessQuery>>({
    queryKey: [QueryKeys.BUSINESS, input],
    queryFn: getBusinessFn,
    ...options,
  });
};

export const useGetBusinessSettingsData = (
  input: GetBusinessInput,
  options: UseQueryOptions<GraphQLResult<getBusinessSettingsQueryResponse>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessSettingsQueryResponse>>({
    queryKey: [QueryKeys.BUSINESS_SETTINGS, input],
    queryFn: getBusinessSettingsDataFn,
    ...options,
  });
};

export const useGetBusinessLocations = (
  input: GetBusinessInput,
  filterInput?: FilterLocationsInput,
  options: UseQueryOptions<GraphQLResult<getBusinessLocationsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessLocationsQuery>>({
    queryKey: [QueryKeys.BUSINESS_LOCATIONS, input, filterInput],
    queryFn: getBusinessLocationsFn,
    ...options,
  });
};

export const useGetBusinessLocationsOverview = (
  input: GetBusinessInput,
  fulfillmentInput?: LocationFulfillmentInput,
  options: UseQueryOptions<GraphQLResult<getBusinessLocationsOverviewQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessLocationsOverviewQuery>>({
    queryKey: [QueryKeys.BUSINESS_LOCATIONS_OVERVIEW, input, fulfillmentInput],
    queryFn: getBusinessLocationsOverviewFn,
    ...options,
  });
};

export const useCreateBusiness = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createBusinessFn, {
    onSuccess: () => {
      console.log('useCreateBusiness hook onSuccess hit');
      queryClient.invalidateQueries(QueryKeys.PRODUCER_BUSINESS);
    },
    ...options,
  });
};

export const useUpdateBusiness = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateBusinessFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_SETTINGS);
    },
    onError: (err) => {
      console.log('an error occurred', err);
    },
  });
};
