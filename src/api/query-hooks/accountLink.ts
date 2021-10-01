import { useMutation } from 'react-query';
import { createStripeAccountLinkFn } from '../query-functions/accountLink';

export const useCreateStripeAccountLink = (options = {}) => {
  return useMutation(createStripeAccountLinkFn, {
    ...options,
  });
};

export default useCreateStripeAccountLink;