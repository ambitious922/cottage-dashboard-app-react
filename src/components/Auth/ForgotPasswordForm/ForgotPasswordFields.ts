import * as Yup from 'yup';

export interface IForgotPasswordFields {
  email: string;
}

export const ForgotPasswordValues = {
  email: '',
};

export const ForgotPasswordValidation = Yup.object().shape({
  email: Yup.string().email('Email must be valid').required('Email is required'),
});
