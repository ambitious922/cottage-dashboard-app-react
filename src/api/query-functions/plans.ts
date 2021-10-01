import { API, graphqlOperation } from 'aws-amplify';
import {
  ArchivePlanInput,
  ArchivePlanMutation,
  CreatePlanInput,
  CreatePlanMutation,
  getBusinessPlansQuery,
  getBusinessPlansQueryVariables,
  getLocationPlansQuery,
  getLocationPlansQueryVariables,
  getPlanLocationsQuery,
  getPlanLocationsQueryVariables,
  getPlanLocationsStatisticsQuery,
  getPlanLocationsStatisticsQueryVariables,
  getPlanQuery,
  getPlanQueryVariables,
  getPlanSubscriptionsQuery,
  getPlanSubscriptionsQueryVariables,
  UpdatePlanInput,
  UpdatePlanMutation,
} from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import {
  archivePlanMutationGql,
  createPlanMutationGql,
  getBusinessPlansQueryGql,
  getLocationPlansQueryGql,
  getPlanLocationsGql,
  getPlanLocationsStatisticsGql,
  getPlanQueryGql,
  getPlanSubscriptionsGql,
  updatePlanLocationsGql,
  updatePlanMutationGql,
} from 'api/graphql/plans';
import { QueryFnProps } from 'models/react-query';

export const getBusinessPlansFn = async ({
  queryKey,
}: QueryFnProps<getBusinessPlansQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessPlansQueryGql, { input, filterInput, pagination })
  )) as GraphQLResult<getBusinessPlansQuery>;
  return data;
};

export const getLocationPlansFn = async ({
  queryKey,
}: QueryFnProps<getLocationPlansQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getLocationPlansQueryGql, { input })
  )) as GraphQLResult<getLocationPlansQuery>;
  return data;
};

export const getPlanSubscriptionsFn = async ({
  queryKey,
}: QueryFnProps<getPlanSubscriptionsQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getPlanSubscriptionsGql, { input, filterInput, pagination })
  )) as GraphQLResult<getPlanSubscriptionsQuery>;
  return data;
};

export const getPlanLocationsFn = async ({
  queryKey,
}: QueryFnProps<getPlanLocationsQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getPlanLocationsGql, { input })
  )) as GraphQLResult<getPlanLocationsQuery>;
  return data;
};

export const getPlanLocationsStatisticsFn = async ({
  queryKey,
}: QueryFnProps<getPlanLocationsStatisticsQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getPlanLocationsStatisticsGql, { input })
  )) as GraphQLResult<getPlanLocationsStatisticsQuery>;
  return data;
};

export const getPlanFn = async ({ queryKey }: QueryFnProps<getPlanQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getPlanQueryGql, { input })
  )) as GraphQLResult<getPlanQuery>;
  return data;
};

export const createPlanFn = async (input: CreatePlanInput) => {
  const data = API.graphql(
    graphqlOperation(createPlanMutationGql, { input })
  ) as GraphQLResult<CreatePlanMutation>;
  return data;
};

export const updatePlanFn = async (input: UpdatePlanInput) => {
  const data = API.graphql(
    graphqlOperation(updatePlanMutationGql, { input })
  ) as GraphQLResult<UpdatePlanMutation>;
  return data;
};

export const updatePlanLocationsFn = async (input: UpdatePlanInput) => {
  const data = API.graphql(
    graphqlOperation(updatePlanLocationsGql, { input })
  ) as GraphQLResult<UpdatePlanMutation>;
  return data;
};

export const archivePlanFn = async (input: ArchivePlanInput) => {
  const data = API.graphql(
    graphqlOperation(archivePlanMutationGql, { input })
  ) as GraphQLResult<ArchivePlanMutation>;
  return data;
};
