import { GraphQLResult } from '@aws-amplify/api';
import {
  FilterBalanceTransactionsInput,
  getBusinessBalanceTransactionsQuery,
  GetBusinessInput,
  PaginationInput,
} from 'API';
import { getBusinessBalanceTransactionsFn } from 'api/query-functions/balancetransactions';
import { QueryKeys } from 'models/react-query';
import { useQuery, UseQueryOptions } from 'react-query';

export const useGetBusinessBalanceTransactions = (
  input: GetBusinessInput,
  filters: FilterBalanceTransactionsInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<getBusinessBalanceTransactionsQuery>> = {}
) => {
  return useQuery<GraphQLResult<getBusinessBalanceTransactionsQuery>>({
    queryKey: [QueryKeys.BUSINESS_BALANCE_TRANSACTIONS, input, filters, pagination],
    queryFn: getBusinessBalanceTransactionsFn,
    ...options,
  });
};
