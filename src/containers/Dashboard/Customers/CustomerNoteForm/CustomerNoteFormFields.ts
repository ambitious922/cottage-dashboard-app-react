import * as Yup from 'yup';

export interface ICustomerNoteFormValues {
  businessNote: string | undefined | null;
}

export const CustomerNoteFormValues: ICustomerNoteFormValues = {
  businessNote: '',
};

export const CustomerNoteFormValidation = Yup.object().shape({
  businessNote: Yup.string()
    .notRequired()
    .nullable()
    .min(0)
    .max(250, 'Note cannot be greater than 250 characters'),
});
