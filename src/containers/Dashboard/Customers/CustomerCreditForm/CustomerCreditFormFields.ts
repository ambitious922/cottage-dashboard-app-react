import { MIN_DOLLARS, MAX_DOLLARS } from 'constants/index';
import * as Yup from 'yup';

export interface ICreditFormValues {
  amount: number | undefined;
  description: string | undefined | null;
}

export const CreateCreditFormValues: ICreditFormValues = {
  amount: undefined,
  description: '',
};

export const CreditFormValidation = Yup.object().shape({
  amount: Yup.number()
    .required('Price is required')
    .notOneOf([0], 'Invalid price')
    .min(MIN_DOLLARS, 'Price is too low')
    .max(MAX_DOLLARS, 'Price is too high'),
  description: Yup.string().notRequired().nullable().min(0).max(250, 'Description is too long'),
});
