import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import {
  CreateOrderRefundInput,
  CreateOrderRefundMutation,
  RefundQuery,
  RefundQueryVariables,
} from 'API';
import { QueryFnProps } from 'models/react-query';
import { createOrderRefundMutationGql, getRefundQueryGql } from 'api/graphql/refund';

export const getRefundFn = async ({ queryKey }: QueryFnProps<RefundQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getRefundQueryGql, { input })
  )) as GraphQLResult<RefundQuery>;
  return data;
};

export const createOrderRefundFn = async (input: CreateOrderRefundInput) => {
  const data = API.graphql(
    graphqlOperation(createOrderRefundMutationGql, { input })
  ) as GraphQLResult<CreateOrderRefundMutation>;
  return data;
};
