import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { CancelSubscriptionInput, CancelSubscriptionMutation } from 'API';
import { cancelSubscriptionMutationGql } from 'api/graphql/subscription';

export const cancelSubscriptionFn = async (input: CancelSubscriptionInput) => {
  const data = API.graphql(graphqlOperation(cancelSubscriptionMutationGql, { input })) as GraphQLResult<CancelSubscriptionMutation>;
  return data;
};

