import {
  FilterSubscriptionInvoicesInput,
  GetBusinessInput,
  getBusinessSubscriptionInvoicesQuery,
  GetSubscriptionInvoiceInput,
  getSubscriptionInvoiceQuery,
  PaginationInput,
} from 'API';
import { QueryKeys } from 'models/react-query';
import { GraphQLResult } from '@aws-amplify/api';
import { useQuery, UseQueryOptions } from 'react-query';
import {
  getBusinessSubscriptionInvoicesFn,
  getSubscriptionInvoiceFn,
} from 'api/query-functions/subscriptioninvoices';

export const useGetBusinessSubscriptionInvoices = (
  input: GetBusinessInput,
  filters: FilterSubscriptionInvoicesInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getBusinessSubscriptionInvoicesQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessSubscriptionInvoicesQuery>>({
    queryKey: [QueryKeys.BUSINESS_SUBSCRIPTION_INVOICE, input, filters, pagination],
    queryFn: getBusinessSubscriptionInvoicesFn,
    ...options,
  });
};

export const useGetSubscriptionInvoice = (
  input: GetSubscriptionInvoiceInput,
  options: UseQueryOptions<GraphQLResult<getSubscriptionInvoiceQuery>> = {}
) => {
  return useQuery<GraphQLResult<getSubscriptionInvoiceQuery>>({
    queryKey: [QueryKeys.SUBSCRIPTION_INVOICE, input],
    queryFn: getSubscriptionInvoiceFn,
    ...options,
  });
};
