import { GraphQLResult } from '@aws-amplify/api';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import {
  ByIdInput,
  ExportOrdersInput,
  ExportOrdersQuery,
  FilterOrdersInput,
  GetBusinessInput,
  getBusinessOrdersQuery,
  getLocationOrdersQuery,
  GetOrderInput,
  getOrderQuery,
  PaginationInput,
} from 'API';
import { MutationOptions, QueryKeys } from 'models/react-query';
import {
  exportOrdersFn,
  getBusinessOrdersFn,
  getLocationOrdersFn,
  getOrderFn,
  transitionOrderCanceledFn,
  transitionOrderCompleteFn,
} from 'api/query-functions/order';

export const useGetBusinessOrders = (
  input: GetBusinessInput,
  filters: FilterOrdersInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getBusinessOrdersQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessOrdersQuery>>({
    queryKey: [QueryKeys.BUSINESS_ORDERS, input, filters, pagination],
    queryFn: getBusinessOrdersFn,
    ...options,
  });
};

export const useGetLocationOrders = (
  input: ByIdInput,
  filters: FilterOrdersInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getLocationOrdersQuery>> = {}
) => {
  return useQuery<GraphQLResult<getLocationOrdersQuery>>({
    queryKey: [QueryKeys.LOCATION_ORDERS, input, filters, pagination],
    queryFn: getLocationOrdersFn,
    ...options,
  });
};

export const useGetLocationOverviewOrders = (
  input: ByIdInput,
  filters: FilterOrdersInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getLocationOrdersQuery>> = {}
) => {
  return useQuery<GraphQLResult<getLocationOrdersQuery>>({
    queryKey: [QueryKeys.LOCATION_OVERVIEW_ORDERS, input, filters, pagination],
    queryFn: getLocationOrdersFn,
    ...options,
  });
};

export const useGetOrder = (
  input: GetOrderInput,
  options: UseQueryOptions<GraphQLResult<getOrderQuery>> = {}
) => {
  return useQuery<GraphQLResult<getOrderQuery>>({
    queryKey: [QueryKeys.ORDER, input],
    queryFn: getOrderFn,
    ...options,
  });
};

export const useTransitionOrderComplete = (options: MutationOptions | any = {}) => {
  return useMutation(transitionOrderCompleteFn);
};

export const useTransitionOrderLocationCanceled = (options: MutationOptions | any = {}) => {
  return useMutation(transitionOrderCanceledFn);
};

export const useExportOrders = (
  input: ExportOrdersInput,
  options: UseQueryOptions<GraphQLResult<ExportOrdersQuery>> = {}
) => {
  return useQuery<GraphQLResult<ExportOrdersQuery>>({
    queryKey: [QueryKeys.EXPORT_ORDERS, input],
    queryFn: exportOrdersFn,
    ...options,
  });
};
