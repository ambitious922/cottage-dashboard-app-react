import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryFnProps } from 'models/react-query';
import { getBusinessConsumersQuery, getBusinessConsumersQueryVariables, GetConsumerQuery, GetConsumerQueryVariables, getConsumerSubscriptionsQuery, getConsumerSubscriptionsQueryVariables, getConsumerTransactionsQuery, getConsumerTransactionsQueryVariables, UpdateConsumerInput, UpdateConsumerMutation } from 'API';
import { getBusinessConsumersQueryGql, getConsumerQueryGql, getConsumerSubscriptionsQueryGql, getConsumerTransactionsQueryGql, updateConsumerNoteGql, updateConsumerStatusGql } from 'api/graphql/consumer';

export const getBusinessConsumersFn = async ({ queryKey }: QueryFnProps<getBusinessConsumersQueryVariables>) => {
  const [, input, filters, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessConsumersQueryGql, { input, filters, pagination })
  )) as GraphQLResult<getBusinessConsumersQuery>;
  return data;
};

export const getConsumerTransactionsFn = async ({ queryKey }: QueryFnProps<getConsumerTransactionsQueryVariables>) => {
  const [, input, filters, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getConsumerTransactionsQueryGql, { input, filters, pagination })
  )) as GraphQLResult<getConsumerTransactionsQuery>;
  return data;
};

export const getConsumerSubscriptionsFn = async ({ queryKey }: QueryFnProps<getConsumerSubscriptionsQueryVariables>) => {
  const [, input, filters, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getConsumerSubscriptionsQueryGql, { input, filters, pagination })
  )) as GraphQLResult<getConsumerSubscriptionsQuery>;
  return data;
};

export const getConsumerFn = async ({ queryKey }: QueryFnProps<GetConsumerQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getConsumerQueryGql, { input })
  )) as GraphQLResult<GetConsumerQuery>;
  return data;
};

export const updateConsumerStatusFn = async (input: UpdateConsumerInput) => {
  const data = API.graphql(
    graphqlOperation(updateConsumerStatusGql, { input })
  ) as GraphQLResult<UpdateConsumerMutation>;
  return data;
};

export const updateConsumerNoteFn = async (input: UpdateConsumerInput) => {
  const data = API.graphql(
    graphqlOperation(updateConsumerNoteGql, { input })
  ) as GraphQLResult<UpdateConsumerMutation>;
  return data;
};
