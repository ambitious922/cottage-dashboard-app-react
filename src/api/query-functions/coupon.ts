import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { getCouponQueryGql, createCouponMutationGql, getBusinessCouponsQueryGql, updateCouponMutationGql, archiveCouponMutationGql, getCouponOrdersGql, updateCouponLocationsGql, getCouponLocationsGql, getLocationCouponsQueryGql } from 'api/graphql/coupons';
import { QueryFnProps } from 'models/react-query';
import { CouponQuery, CreateCouponInput, CreateCouponMutation, getBusinessCouponsQuery, getBusinessCouponsQueryVariables, getCouponLocationsQuery, getCouponLocationsQueryVariables, getCouponOrdersQuery, getCouponOrdersQueryVariables, getCouponQueryVariables, getLocationCouponsQuery, getLocationCouponsQueryVariables, UpdateCouponInput, UpdateCouponMutation } from 'API';

export const getBusinessCouponsFn = async ({ queryKey }: QueryFnProps<getBusinessCouponsQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getBusinessCouponsQueryGql, { input, filterInput, pagination })
  )) as GraphQLResult<getBusinessCouponsQuery>;
  return data;
};

export const getLocationCouponsFn = async ({ queryKey }: QueryFnProps<getLocationCouponsQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getLocationCouponsQueryGql, { input })
  )) as GraphQLResult<getLocationCouponsQuery>;
  return data;
};

export const getCouponFn = async ({ queryKey }: QueryFnProps<getCouponQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getCouponQueryGql, { input })
  )) as GraphQLResult<CouponQuery>;
  return data;
};

export const getCouponOrdersFn = async ({ queryKey }: QueryFnProps<getCouponOrdersQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(graphqlOperation(getCouponOrdersGql, { input, filterInput, pagination }))) as
    GraphQLResult<getCouponOrdersQuery>;
  return data;
};

export const getCouponLocationsFn = async ({ queryKey }: QueryFnProps<getCouponLocationsQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(graphqlOperation(getCouponLocationsGql, { input }))) as GraphQLResult<getCouponLocationsQuery>;
  return data;
};

export const createCouponFn = async (input: CreateCouponInput) => {
  const data = API.graphql(graphqlOperation(createCouponMutationGql, { input })) as GraphQLResult<CreateCouponMutation>;
  return data;
};

export const updateCouponFn = async (input: UpdateCouponInput) => {
  const data = API.graphql(graphqlOperation(updateCouponMutationGql, { input })) as GraphQLResult<UpdateCouponMutation>;
  return data;
};

export const updateCouponLocationsFn = async (input: UpdateCouponInput) => {
  const data = API.graphql(graphqlOperation(updateCouponLocationsGql, { input })) as GraphQLResult<UpdateCouponMutation>;
  return data;
};

export const archiveCouponFn = async (input: UpdateCouponInput) => {
  const data = API.graphql(graphqlOperation(archiveCouponMutationGql, { input })) as GraphQLResult<UpdateCouponMutation>;
  return data;
};

