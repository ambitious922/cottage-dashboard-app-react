import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import {
  createProducerMutationGql,
  getProducerBusinessQueryGql,
  getProducerQueryGql,
} from 'api/graphql/producer';
import { QueryFnProps } from 'models/react-query';
import { CreateProducerInput, CreateProducerMutation, getProducerAndBusinessQuery, getProducerQuery, NullableByIdInput } from 'API';

export const createProducerFn = async (input: CreateProducerInput) => {
  const data = await API.graphql(graphqlOperation(createProducerMutationGql, { input })) as GraphQLResult<CreateProducerMutation> ;
  return data;
};

export const getProducerFn = async ({ queryKey }: QueryFnProps<NullableByIdInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getProducerQueryGql, { input })
  )) as GraphQLResult<getProducerQuery>;
  return data;
};

export const getProducerBusinessFn = async ({ queryKey }: QueryFnProps<NullableByIdInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getProducerBusinessQueryGql, { input })
  )) as GraphQLResult<getProducerAndBusinessQuery>;
  return data;
};
