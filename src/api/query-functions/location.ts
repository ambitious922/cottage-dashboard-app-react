import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

import {
  archiveLocationMutationGql,
  createLocationMutationGql,
  getLocationFulfillmentQueryGql,
  getLocationSettingsQueryGql,
  updateLocationMutationGql
} from 'api/graphql/location';

import { 
  ArchiveLocationInput,
  ArchiveLocationMutation,
  CreateLocationInput,
  CreateLocationMutation, 
  getLocationFulfillmentQuery, 
  getLocationFulfillmentQueryVariables, 
  getLocationSettingsQuery, 
  getLocationSettingsQueryVariables, 
  UpdateLocationInput,
  UpdateLocationMutation,
} from 'API';
import { QueryFnProps } from 'models/react-query';

export const getLocationSettingsDataFn = async ({ queryKey }: QueryFnProps<getLocationSettingsQueryVariables>) => {
  const [, input] = queryKey;
  const data = API.graphql(graphqlOperation(getLocationSettingsQueryGql, { input })) as GraphQLResult<getLocationSettingsQuery>;
  return data;
}

export const createLocationFn = async (input: CreateLocationInput) => {
  const data = API.graphql(graphqlOperation(createLocationMutationGql, { input })) as GraphQLResult<CreateLocationMutation>;
  return data;
};

export const updateLocationFn = async (input: UpdateLocationInput) => {
  const data = API.graphql(graphqlOperation(updateLocationMutationGql, { input })) as GraphQLResult<UpdateLocationMutation>;
  return data;
};

export const archiveLocationFn = async (input: ArchiveLocationInput) => {
  const data = API.graphql(graphqlOperation(archiveLocationMutationGql, { input })) as GraphQLResult<ArchiveLocationMutation>;
  return data;
};

export const getLocationFulfillmentFn = async ({
  queryKey,
}: QueryFnProps<getLocationFulfillmentQueryVariables>) => {
  const [, input, fulfillmentInput] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getLocationFulfillmentQueryGql, { input, fulfillmentInput})
  )) as GraphQLResult<getLocationFulfillmentQuery>;
  return data;
};

