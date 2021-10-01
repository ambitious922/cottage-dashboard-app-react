import { useQueryClient, useMutation } from 'react-query';
import { createBusinessBankAccountFn } from '../query-functions/bankAccount';
import { QueryKeys } from 'models/react-query';


export const useCreateBusinessBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(createBusinessBankAccountFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_SETTINGS);
      queryClient.invalidateQueries(QueryKeys.BUSINESS);
    },
  });
};
