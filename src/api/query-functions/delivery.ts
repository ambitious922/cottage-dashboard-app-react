import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryFnProps } from 'models/react-query';
import { ArchiveDeliveryInput, ArchiveDeliveryMutation, CreateDeliveryInput, CreateDeliveryMutation, getLocationDeliveriesQuery, getLocationDeliveriesQueryVariables, UpdateDeliveryInput, UpdateDeliveryMutation } from 'API';
import { archiveDeliveryMutationGql, createDeliveryMutationGql, getLocationDeliveriesQueryGql, updateDeliveryMutationGql } from 'api/graphql/delivery';

export const getLocationDeliveriesFn = async ({ queryKey }: QueryFnProps<getLocationDeliveriesQueryVariables>) => {
  const [, input, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getLocationDeliveriesQueryGql, { input, pagination })
  )) as GraphQLResult<getLocationDeliveriesQuery>;
  return data;
};

export const createDeliveryFn = async (input: CreateDeliveryInput) => {
  const data = API.graphql(graphqlOperation(createDeliveryMutationGql, { input })) as GraphQLResult<CreateDeliveryMutation>;
  return data;
};

export const updateDeliveryFn = async (input: UpdateDeliveryInput) => {
  const data = API.graphql(graphqlOperation(updateDeliveryMutationGql, { input })) as GraphQLResult<UpdateDeliveryMutation>;
  return data;
};

export const archiveDeliveryFn = async (input: ArchiveDeliveryInput) => {
  const data = API.graphql(graphqlOperation(archiveDeliveryMutationGql, { input })) as GraphQLResult<ArchiveDeliveryMutation>;
  return data;
};