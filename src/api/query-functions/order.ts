import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryFnProps } from 'models/react-query';
import { getBusinessOrdersQuery, getBusinessOrdersQueryVariables, getLocationOrdersQuery, getLocationOrdersQueryVariables, getOrderQuery, getOrderQueryVariables, TransitionOrderCompleteInput, TransitionOrderCompleteMutation, TransitionOrderLocationCanceledInput, TransitionOrderLocationCanceledMutation, ExportOrdersInput, ExportOrdersQuery, exportOrdersQueryVariables } from 'API';
import { getBusinessOrdersQueryGql, getLocationOrdersQueryGql, getOrderQueryGql, transitionOrderCompleteMutationGql, transitionOrderLocationCanceledMutationGql, exportOrdersQueryGql } from 'api/graphql/order';

export const getBusinessOrdersFn = async ({ queryKey }: QueryFnProps<getBusinessOrdersQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessOrdersQueryGql, { input, filterInput, pagination })
  )) as GraphQLResult<getBusinessOrdersQuery>;
  return data;
};

export const getLocationOrdersFn = async ({ queryKey }: QueryFnProps<getLocationOrdersQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getLocationOrdersQueryGql, { input, filterInput, pagination })
  )) as GraphQLResult<getLocationOrdersQuery>;
  return data;
};

export const getOrderFn = async ({ queryKey }: QueryFnProps<getOrderQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getOrderQueryGql, { input })
  )) as GraphQLResult<getOrderQuery>;
  return data;
};

export const transitionOrderCompleteFn = async (input: TransitionOrderCompleteInput) => {
  const data = API.graphql(
    graphqlOperation(transitionOrderCompleteMutationGql, { input })
  ) as GraphQLResult<TransitionOrderCompleteMutation>;
  return data;
};

export const transitionOrderCanceledFn = async (input: TransitionOrderLocationCanceledInput) => {
  const data = API.graphql(
    graphqlOperation(transitionOrderLocationCanceledMutationGql, { input })
  ) as GraphQLResult<TransitionOrderLocationCanceledMutation>;
  return data;
};

export const exportOrdersFn = async ({ queryKey }: QueryFnProps<exportOrdersQueryVariables>) => {
  const [, input] = queryKey;
  const data = API.graphql(
    graphqlOperation(exportOrdersQueryGql, { input })
  ) as GraphQLResult<ExportOrdersQuery>;
  return data;
};