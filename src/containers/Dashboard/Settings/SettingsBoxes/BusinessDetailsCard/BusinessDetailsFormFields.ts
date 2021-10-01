import * as Yup from 'yup';

export interface IBusinessDetailsFormValues {
  phoneNumber: string;
  email: string;
}

export const BusinessDetailsFormValidation = Yup.object().shape({
  email: Yup.string().email(),
  phoneNumber: Yup.string()
    .min(12, 'That phone number is too short.')
    .max(12, 'That phone number is too long.'),
});
