import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import {
  createBusinessMutationGql,
  updateBusinessSettingsMutationGql,
  getBusinessSettingsQueryGql,
  getBusinessLocationsQueryGql,
  getBusinessQueryGql,
  getBusinessLocationsOverviewQueryGql,
} from 'api/graphql/business';
import { QueryFnProps } from 'models/react-query';
import { 
  CreateBusinessInput, 
  UpdateBusinessInput, 
  BusinessStatus, 
  BusinessLevelType, 
  BusinessType, 
  StateOrProvince, 
  CountryCode,
  BankAccountType,
  LocationConnection, 
  getBusinessLocationsQuery, 
  getBusinessQuery,
  CreateBusinessMutation,
  UpdateBusinessMutation, 
  GetBusinessInput,
  getBusinessLocationsOverviewQuery,
} from 'API';

export type getBusinessSettingsQueryResponse = {
  getBusiness?:  {
    __typename: "Business",
    id: string,
    status: BusinessStatus,
    level: BusinessLevelType,
    title: string,
    phoneNumber: string,
    email: string,
    avatarImage: string,
    coverImage: string,
    type: BusinessType,
    subdomain: string;
    address:  {
      __typename: "Address",
      city: string,
      street: string,
      street2?: string | null,
      postalCode: string,
      stateOrProvince?: StateOrProvince | null,
      country: CountryCode,
    } | null,
    bankAccount?:  {
      __typename: "BankAccount",
      id: string,
      type: BankAccountType,
      accountHolderName: string,
      lastFour: string,
      bankName: string,
      routingNumber: string,
    } | null,
  } | null,
};

export type GetBusinessMetaDataQueryResponse = {
  __typename: "Business",
  id: string,
  status: BusinessStatus,
  level: BusinessLevelType,
  title: string,
  locations: LocationConnection,
}

export const getBusinessFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessQueryGql, { input })
  )) as GraphQLResult<getBusinessQuery>;
  return data;
};

export const getBusinessSettingsDataFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessSettingsQueryGql, { input })
  )) as GraphQLResult<getBusinessSettingsQueryResponse>;
  return data;
}

export const getBusinessLocationsFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessLocationsQueryGql, { input }))) as GraphQLResult<getBusinessLocationsQuery>;
  return data;
};

export const getBusinessLocationsOverviewFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input, fulfillmentInput] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessLocationsOverviewQueryGql, { input, fulfillmentInput }))) as GraphQLResult<getBusinessLocationsOverviewQuery>;
  return data;
};

export const createBusinessFn = async (input: CreateBusinessInput) => {
  const data = (await API.graphql(
    graphqlOperation(createBusinessMutationGql, { input }))) as GraphQLResult<CreateBusinessMutation>;
  return data;
};

export const updateBusinessFn = async (input: UpdateBusinessInput) => {
  const data = (await API.graphql(
  graphqlOperation(updateBusinessSettingsMutationGql, { input }))) as GraphQLResult<UpdateBusinessMutation>;
  return data;
}
