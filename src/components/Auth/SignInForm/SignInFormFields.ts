import * as Yup from 'yup';

export enum SignInFormFields {
  email = 'email',
  password = 'password',
}

export const SignInFormValues = {
  email: '',
  password: '',
};

export const SigninFormValidation = Yup.object().shape({
  email: Yup.string().email("Email must be valid").required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password is too short'),
});
