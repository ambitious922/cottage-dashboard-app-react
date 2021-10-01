import { useQueryClient, useMutation, MutationOptions } from "react-query";
import { updateTaxRateFn } from "api/query-functions/taxRate";
import { QueryKeys } from "models/react-query";

export const useUpdateTaxRate = (options: MutationOptions | any = {}) => {
    const queryClient = useQueryClient();
    return useMutation(updateTaxRateFn, {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.LOCATION);
      },
      onError: (err) => {
        console.log('an error occurred', err);
      }
    });
  }
  