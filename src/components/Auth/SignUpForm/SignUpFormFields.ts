import * as Yup from 'yup';

export enum SignUpFormFields {
  email = 'email',
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
  firstName = 'firstName',
  lastName = 'lastName',
}

export const SignUpFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export const SignUpFormValidation = Yup.object().shape({
  email: Yup
    .string()
    .email('Email must be valid')
    .required('Email is required'),
  firstName: Yup
    .string()
    .required('First Name is required')
    .min(1, 'Cannot be less than 1 character')
    .max(30, 'Cannot be greater than 30 characters'),
  lastName: Yup
    .string()
    .required('Last Name is required')
    .min(1, 'Cannot be less than 1 character')
    .max(30, 'Cannot be greater than 30 characters'),
  password: Yup
  .string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must contain 8 characters, one lowercase, one number, and one special character'
    ),
  passwordConfirmation: Yup
    .string()
    .required('Password confirmation is requried')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
