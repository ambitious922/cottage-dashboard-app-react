import {
  useQuery,
  useMutation,
  MutationOptions,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import {
  ByIdInput,
  FilterPlansInput,
  FilterSubscriptionsInput,
  GetBusinessInput,
  getBusinessPlansQuery,
  getLocationPlansQuery,
  GetPlanInput,
  getPlanLocationsQuery,
  getPlanLocationsStatisticsQuery,
  getPlanQuery,
  getPlanSubscriptionsQuery,
  PaginationInput,
} from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryKeys } from 'models/react-query';
import {
  archivePlanFn,
  createPlanFn,
  getBusinessPlansFn,
  getLocationPlansFn,
  getPlanFn,
  getPlanLocationsFn,
  getPlanLocationsStatisticsFn,
  getPlanSubscriptionsFn,
  updatePlanFn,
  updatePlanLocationsFn,
} from 'api/query-functions/plans';
import { getImagesFn, GetImagesInput, uploadImage } from 'api/images';

export const useGetPlan = (
  input: GetPlanInput,
  options: UseQueryOptions<GraphQLResult<getPlanQuery>> = {}
) => {
  return useQuery<GraphQLResult<getPlanQuery>>({
    queryKey: [QueryKeys.PLAN, input],
    queryFn: getPlanFn,
    ...options,
  });
};

export const useGetBusinessPlans = (
  input: GetBusinessInput,
  filters: FilterPlansInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getBusinessPlansQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessPlansQuery>>({
    queryKey: [QueryKeys.BUSINESS_PLANS, input, filters, pagination],
    queryFn: getBusinessPlansFn,
    ...options,
  });
};

export const useGetLocationPlans = (
  input: ByIdInput,
  options: UseQueryOptions<GraphQLResult<getLocationPlansQuery>> = {}
) => {
  return useQuery<GraphQLResult<getLocationPlansQuery>>({
    queryKey: [QueryKeys.LOCATION_PLANS, input],
    queryFn: getLocationPlansFn,
    ...options,
  });
};

export const useGetPlanSubscriptions = (
  input: GetPlanInput,
  filters: FilterSubscriptionsInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getPlanSubscriptionsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getPlanSubscriptionsQuery>>({
    queryKey: [QueryKeys.PLAN_SUBSCRIPTIONS, input, filters, pagination],
    queryFn: getPlanSubscriptionsFn,
    ...options,
  });
};

export const useGetPlanLocations = (
  input: GetPlanInput,
  options: UseQueryOptions<GraphQLResult<getPlanLocationsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getPlanLocationsQuery>>({
    queryKey: [QueryKeys.PLAN_LOCATIONS, input],
    queryFn: getPlanLocationsFn,
    ...options,
  });
};

export const useGetPlanLocationsStatistics = (
  input: GetPlanInput,
  options: UseQueryOptions<GraphQLResult<getPlanLocationsStatisticsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getPlanLocationsStatisticsQuery>>({
    queryKey: [QueryKeys.PLAN_LOCATIONS_STATISTICS, input],
    queryFn: getPlanLocationsStatisticsFn,
    ...options,
  });
};

export const useCreatePlan = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createPlanFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PLANS);
      // will refetch on the redirect to plan details page
      queryClient.invalidateQueries(QueryKeys.PLAN);
    },
    ...options,
  });
};

export const useUpdatePlan = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updatePlanFn, {
    onSuccess: () => {
      // will refetch on the redirect to plan details page
      queryClient.invalidateQueries(QueryKeys.PLAN);
      queryClient.invalidateQueries(QueryKeys.PLAN_LOCATIONS);
      // invalidates the list of plans in the business plans page
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PLANS);
      // invalidates the list of plans in the location plans page when opting out
      queryClient.invalidateQueries(QueryKeys.LOCATION_PLANS);
    },
    ...options,
  });
};

export const useUpdatePlanLocations = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();

  return useMutation(updatePlanLocationsFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PLAN_LOCATIONS);
      // invalidates the list of plans in the location plans page when opting out
      queryClient.invalidateQueries(QueryKeys.LOCATION_PLANS);
      // invalidates the list of plans in the business plans page
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PLANS);
    },
    ...options,
  });
};

export const useArchivePlan = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();

  return useMutation(archivePlanFn, {
    onSuccess: () => {
      // will refetch on the redirect to plan details page
      queryClient.invalidateQueries(QueryKeys.PLAN);
      // invalidates the list of plans in the business plans page
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PLANS);
      // invalidates the list of plans in the location plans page when opting out
      queryClient.invalidateQueries(QueryKeys.LOCATION_PLANS);
    },
    ...options,
  });
};

export const useUploadPlanImage = (options = {}) => useMutation(uploadImage, { ...options });

export const useGetPlanImages = (
  input: GetImagesInput,
  options: UseQueryOptions<{ data: Map<string, string> }> = {}
) => {
  return useQuery<{ data: Map<string, string> }>({
    queryKey: [QueryKeys.PLAN_IMAGES, input],
    queryFn: getImagesFn,
    ...options,
  });
};
