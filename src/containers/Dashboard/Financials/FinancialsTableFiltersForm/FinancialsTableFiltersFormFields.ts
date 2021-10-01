import { BalanceTransactionType } from 'API';
import * as Yup from 'yup';

export interface IFinancialsFilterFormValues {
  orderNumber: string | undefined;
  orderNumberCheckbox: boolean;
  subscriptionInvoiceNumber: string | undefined;
  subscriptionInvoiceNumberCheckbox: boolean;
  type: BalanceTransactionType | undefined;
  typeCheckbox: boolean;
}

export const FinancialsFilterFormValues: IFinancialsFilterFormValues = {
  orderNumber: undefined,
  orderNumberCheckbox: false,
  subscriptionInvoiceNumber: undefined,
  subscriptionInvoiceNumberCheckbox: false,
  type: undefined,
  typeCheckbox: false,
};

export const FinancialsFilterValidation = Yup.object().shape({
  orderNumber: Yup.string().min(0).max(20),
  subscriptionInvoiceNumber: Yup.string().min(0).max(20),
  type: Yup.mixed().oneOf([
    BalanceTransactionType.PAYOUT,
    BalanceTransactionType.REFUND,
    BalanceTransactionType.CHARGE,
  ]),
});
