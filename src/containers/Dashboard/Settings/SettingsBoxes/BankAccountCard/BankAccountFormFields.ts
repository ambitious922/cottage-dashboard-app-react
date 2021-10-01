import * as Yup from 'yup';

export const BankAccountFormValues = {
    accountHolderName: '',
    routingNumber: undefined,
    accountNumber: undefined,
}

export const BankAccountFormValidation = Yup.object().shape({
    accountHolderName: Yup.string().required('Account holder name is required to verify'),
    routingNumber: Yup.number().required('A valid routing number is required.'),
    accountNumber: Yup.number().required('A valid account number is required.'),
});