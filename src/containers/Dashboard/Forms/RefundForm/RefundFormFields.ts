import { MAX_DOLLARS } from 'constants/index';
import * as Yup from 'yup';

export interface IRefundFormValues {
  amount: number | undefined;
  description: string | undefined | null;
}

export const CreateRefundFormValues: IRefundFormValues = {
  amount: undefined,
  description: '',
};

export const RefundFormValidation = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .notOneOf([0], 'Invalid amount')
    .max(MAX_DOLLARS, 'Amount is too high'),
  description: Yup.string().notRequired().nullable().min(0).max(250, 'Description is too long'),
});
