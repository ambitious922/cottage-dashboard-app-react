import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { CreateCreditInput, CreateCreditMutation } from 'API';
import { createCreditMutationGql } from 'api/graphql/credit';

export const createCreditFn = async (input: CreateCreditInput) => {
  const data = API.graphql(
    graphqlOperation(createCreditMutationGql, { input })
  ) as GraphQLResult<CreateCreditMutation>;
  return data;
};
