import * as Yup from 'yup';

export interface IResetPasswordFields {
  email: string;
  password: string;
  passwordConfirmation: string;
  code: string;
}

export const ResetPasswordValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
  code: '',
};

export const ResetPasswordValidation = Yup.object().shape({
  email: Yup.string().email('Email must be valid').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must contain 8 characters, one lowercase, one number, and one special character'
    ),
  passwordConfirmation: Yup.string()
    .required('Password confirmation is requried')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  code: Yup.string().min(6).max(6).required('Verification code sent to your email is required'),
});
