import {
  useQuery,
  useMutation,
  MutationOptions,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import {
  createCouponFn,
  updateCouponFn,
  getBusinessCouponsFn,
  archiveCouponFn,
  getCouponFn,
  getCouponOrdersFn,
  getCouponLocationsFn,
  updateCouponLocationsFn,
  getLocationCouponsFn,
} from 'api/query-functions/coupon';
import { QueryKeys } from 'models/react-query';
import {
  ByIdInput,
  DateRangeInput,
  FilterCouponsInput,
  getBusinessCouponsQuery,
  GetBusinessInput,
  GetCouponInput,
  getCouponLocationsQuery,
  getCouponOrdersQuery,
  getCouponQuery,
  getLocationCouponsQuery,
  PaginationInput,
} from 'API';
import { GraphQLResult } from '@aws-amplify/api';

export const useGetBusinessCoupons = (
  input: GetBusinessInput,
  filters: FilterCouponsInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getBusinessCouponsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessCouponsQuery>>({
    queryKey: [QueryKeys.BUSINESS_COUPONS, input, filters, pagination],
    queryFn: getBusinessCouponsFn,
    ...options,
  });
};

export const useGetLocationCoupons = (
  input: ByIdInput,
  options: UseQueryOptions<GraphQLResult<getLocationCouponsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getLocationCouponsQuery>>({
    queryKey: [QueryKeys.LOCATION_COUPONS, input],
    queryFn: getLocationCouponsFn,
    ...options,
  });
};

export const useGetCoupon = (
  input: GetCouponInput,
  options: UseQueryOptions<GraphQLResult<getCouponQuery>> = {}
) => {
  return useQuery<GraphQLResult<getCouponQuery>>({
    queryKey: [QueryKeys.COUPON, input],
    queryFn: getCouponFn,
    ...options,
  });
};

export const useGetCouponOrders = (
  input: GetCouponInput,
  filters: DateRangeInput | undefined,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getCouponOrdersQuery>> = {}
) => {
  return useQuery<GraphQLResult<getCouponOrdersQuery>>({
    queryKey: [QueryKeys.COUPON_ORDERS, input, filters, pagination],
    queryFn: getCouponOrdersFn,
    ...options,
  });
};

export const useGetCouponLocations = (
  input: GetCouponInput,
  options: UseQueryOptions<GraphQLResult<getCouponLocationsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getCouponLocationsQuery>>({
    queryKey: [QueryKeys.COUPON_LOCATIONS, input],
    queryFn: getCouponLocationsFn,
    ...options,
  });
};

export const useCreateCoupon = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createCouponFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_COUPONS);
    },
    ...options,
  });
};

export const useUpdateCoupon = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateCouponFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.COUPON);
      queryClient.invalidateQueries(QueryKeys.COUPON_LOCATIONS);
      // invalidates the list of coupons in the location coupons page when opting out
      queryClient.invalidateQueries(QueryKeys.LOCATION_COUPONS);
      // invalidates the list of coupons in the business coupons page
      queryClient.invalidateQueries(QueryKeys.BUSINESS_COUPONS);
    },
    ...options,
  });
};

export const useUpdateCouponLocations = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateCouponLocationsFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.COUPON_LOCATIONS);
      // invalidates the list of coupons in the location coupons page when opting out
      queryClient.invalidateQueries(QueryKeys.LOCATION_COUPONS);
      // invalidates the list of coupons in the business coupons page
      queryClient.invalidateQueries(QueryKeys.BUSINESS_COUPONS);
    },
    ...options,
  });
};

export const useArchiveCoupon = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(archiveCouponFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.COUPON);
      // invalidates the list of coupons in the business coupons page
      queryClient.invalidateQueries(QueryKeys.BUSINESS_COUPONS);
      // invalidates the list of coupons in the location coupons page when opting out
      queryClient.invalidateQueries(QueryKeys.LOCATION_COUPONS);
    },
    ...options,
  });
};
