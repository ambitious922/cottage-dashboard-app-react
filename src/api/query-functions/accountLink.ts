import { GraphQLResult } from '@aws-amplify/api';
import { API, graphqlOperation } from 'aws-amplify';
import { createAccountLinkGql } from '../graphql/accountLink';
import { CreateAccountLinkInput, CreateAccountLinkMutation } from 'API'

export const createStripeAccountLinkFn = async (input: CreateAccountLinkInput) => {
  const data = API.graphql(
    graphqlOperation(createAccountLinkGql, { input })
  ) as GraphQLResult<CreateAccountLinkMutation>;
  return data;
};

export default createStripeAccountLinkFn;