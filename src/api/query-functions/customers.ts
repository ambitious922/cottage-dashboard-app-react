import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryFnProps } from 'models/react-query';
import { ByIdInput, getCustomersQuery } from 'API';
import { getCustomersQueryGql } from 'api/graphql/customers';

export const getCustomersFn = async ({ queryKey }: QueryFnProps<ByIdInput>) => {
  const [, input, filters, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getCustomersQueryGql, { input, filters, pagination })
  )) as GraphQLResult<getCustomersQuery>;
  return data;
};
