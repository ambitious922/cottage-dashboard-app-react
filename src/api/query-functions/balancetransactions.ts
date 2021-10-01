import { GraphQLResult } from "@aws-amplify/api";
import { getBusinessBalanceTransactionsQuery, getBusinessBalanceTransactionsQueryVariables } from "API";
import { getBusinessBalanceTransactionsQueryGql } from "api/graphql/balancetransactions";
import { API, graphqlOperation } from "aws-amplify";
import { QueryFnProps } from "models/react-query";

export const getBusinessBalanceTransactionsFn = async ({ queryKey }: QueryFnProps<getBusinessBalanceTransactionsQueryVariables>) => {
    const [, input, filterInput, pagination] = queryKey;
    const data = (await API.graphql(
      graphqlOperation(getBusinessBalanceTransactionsQueryGql, { input, filterInput, pagination })
    )) as GraphQLResult<getBusinessBalanceTransactionsQuery>;
    return data;
  };