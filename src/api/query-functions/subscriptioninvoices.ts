import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { QueryFnProps } from 'models/react-query';
import { getBusinessSubscriptionInvoicesQuery, getBusinessSubscriptionInvoicesQueryVariables, getSubscriptionInvoiceQuery, getSubscriptionInvoiceQueryVariables } from 'API';
import { businessSubscriptionInvoicesQueryGql, getSubscriptionInvoiceQueryGql } from 'api/graphql/subscriptioninvoice';

export const getBusinessSubscriptionInvoicesFn = async ({ queryKey }: QueryFnProps<getBusinessSubscriptionInvoicesQueryVariables>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(businessSubscriptionInvoicesQueryGql, { input, filterInput, pagination })
  )) as GraphQLResult<getBusinessSubscriptionInvoicesQuery>;
  return data;
};

export const getSubscriptionInvoiceFn = async ({ queryKey }: QueryFnProps< getSubscriptionInvoiceQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getSubscriptionInvoiceQueryGql, { input })
  )) as GraphQLResult<getSubscriptionInvoiceQuery>;
  return data;
};