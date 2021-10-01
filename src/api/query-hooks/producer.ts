import { useQueryClient, useMutation, useQuery, UseQueryOptions } from 'react-query';
import {
  createProducerFn,
  getProducerBusinessFn,
  getProducerFn,
} from 'api/query-functions/producer';
import { QueryKeys } from 'models/react-query';
import { NullableByIdInput, getProducerQuery, getProducerAndBusinessQuery } from 'API';
import { GraphQLResult } from '@aws-amplify/api';

export const useCreateProducer = () => {
  const queryClient = useQueryClient();
  return useMutation(createProducerFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PRODUCER);
      queryClient.invalidateQueries(QueryKeys.PRODUCER_BUSINESS);
    },
  });
};

export const useGetProducer = (
  input: NullableByIdInput,
  options: UseQueryOptions<GraphQLResult<getProducerQuery>> = {}
) => {
  return useQuery<GraphQLResult<getProducerQuery>>({
    queryKey: [QueryKeys.PRODUCER, input],
    queryFn: getProducerFn,
    ...options,
  });
};

export const useGetProducerBusiness = (
  input: NullableByIdInput,
  options: UseQueryOptions<GraphQLResult<getProducerAndBusinessQuery>> = {}
) => {
  return useQuery<GraphQLResult<getProducerAndBusinessQuery>>({
    queryKey: [QueryKeys.PRODUCER_BUSINESS, input],
    queryFn: getProducerBusinessFn,
    ...options,
  });
};
