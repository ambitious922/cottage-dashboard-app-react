import { GraphQLResult } from "@aws-amplify/api-graphql";
import { UpdateTaxRateInput, UpdateTaxRateMutation } from "API";
import { updateTaxRateGql } from "api/graphql/taxRate";
import { API, graphqlOperation} from 'aws-amplify';



export const updateTaxRateFn = async (input: UpdateTaxRateInput) => {
    const data = (await API.graphql(
        graphqlOperation(updateTaxRateGql, { input }))) as GraphQLResult<UpdateTaxRateMutation>;
    return data;
}
  