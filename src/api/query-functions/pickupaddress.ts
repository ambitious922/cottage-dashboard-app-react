import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryFnProps } from 'models/react-query';
import { ArchivePickupAddressInput, ArchivePickupAddressMutation, CreatePickupAddressInput, CreatePickupAddressMutation, getLocationPickupAddressesQuery, getLocationPickupAddressesQueryVariables, UpdatePickupAddressInput, UpdatePickupAddressMutation } from 'API';
import { archivePickupAddressMutationGql, createPickupAddressMutationGql, getLocationPickupAddressesQueryGql, updatePickupAddressMutationGql } from 'api/graphql/pickupaddress';

export const getLocationPickupAddressesFn = async ({ queryKey }: QueryFnProps<getLocationPickupAddressesQueryVariables>) => {
  const [, input, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getLocationPickupAddressesQueryGql, { input, pagination })
  )) as GraphQLResult<getLocationPickupAddressesQuery>;
  return data;
};

export const createPickupAddressFn = async (input: CreatePickupAddressInput) => {
  const data = API.graphql(graphqlOperation(createPickupAddressMutationGql, { input })) as GraphQLResult<CreatePickupAddressMutation>;
  return data;
};

export const updatePickupAddressFn = async (input: UpdatePickupAddressInput) => {
  const data = API.graphql(graphqlOperation(updatePickupAddressMutationGql, { input })) as GraphQLResult<UpdatePickupAddressMutation>;
  return data;
};

export const archivePickupAddressFn = async (input: ArchivePickupAddressInput) => {
  const data = API.graphql(graphqlOperation(archivePickupAddressMutationGql, { input })) as GraphQLResult<ArchivePickupAddressMutation>;
  return data;
};