import { InvoiceStatus } from 'API';
import * as Yup from 'yup';

export interface ISubscriptionInvoicesFilterFormValues {
  invoiceNumber: string | undefined;
  invoiceNumberCheckbox: boolean;
  email: string | undefined;
  emailCheckbox: boolean;
  status: InvoiceStatus | undefined;
  statusCheckbox: boolean;
  planCheckbox: boolean;
  planId: string | undefined;
}

export const SubscriptionInvoicesFilterFormValues: ISubscriptionInvoicesFilterFormValues = {
  invoiceNumber: undefined,
  invoiceNumberCheckbox: false,
  email: undefined,
  emailCheckbox: false,
  status: undefined,
  statusCheckbox: false,
  planCheckbox: false,
  planId: undefined,
};

export const SubscriptionInvoicesFilterValidation = Yup.object().shape({
  subscriptionInvoiceNumber: Yup.string().min(0).max(20),
  email: Yup.string().email(),
  // not exposed to the customer but still adding an arbitrary min/max
  planId: Yup.string().min(1).max(70),
  status: Yup.mixed().oneOf([
    InvoiceStatus.PAID,
    InvoiceStatus.VOID,
    InvoiceStatus.OPEN,
    InvoiceStatus.UNCOLLECTIBLE,
  ]),
});
