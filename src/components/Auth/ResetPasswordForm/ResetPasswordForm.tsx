import React, { useEffect } from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import Link from 'components/Common/Link';
import { PageRoutes } from 'constants/Routes';
import {
  ResetPasswordValidation,
  ResetPasswordValues,
  IResetPasswordFields,
} from './ResetPasswordFields';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Box,
  useToast,
} from '@chakra-ui/react';

import { resetPassword } from 'api/auth';
import { useHistory } from 'react-router';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { successToast } from 'components/Common/Toast';

interface IResetPasswordProps {
  fromForgotPassword: boolean;
  email: string;
}

const TOAST_MESSAGE =
  'If a user with that email exists, an email was sent. Please check your inbox or promotions folder for a verification code and enter it in the form below.';

const ResetPasswordForm: React.FC<IResetPasswordProps> = ({ fromForgotPassword, email }) => {
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    // customer is in the process of resetting their password
    if (fromForgotPassword) {
      // toast for 30 seconds
      successToast(toast, TOAST_MESSAGE, undefined, 30000);
    } else {
      history.push(PageRoutes.FORGOT_PASSWORD);
    }
  }, []);

  const onSubmit = async (
    password: string,
    code: string,
    helpers: FormikHelpers<IResetPasswordFields>
  ) => {
    // reset form error
    helpers.setStatus({ errorResponseMessage: '' });

    try {
      await resetPassword(email, password, code);
      history.push(PageRoutes.SIGN_IN);
    } catch (e) {
      console.error(e);
      switch (e.code) {
        default:
          helpers.setStatus({
            errorResponseMessage: 'Something went wrong, try again in a little while.',
          });
          helpers.setSubmitting(false);
          break;
      }
    }
  };
  return (
    <>
      <div>
        <img
          className="mx-auto h-12 mb-10 w-auto"
          src="https://cdn.cottage.menu/assets/dashboard/dashboard_cottage_logo.svg"
          alt="Cottage Logo"
          onClick={() => history.push(PageRoutes.SIGN_IN)}
        />
      </div>
      <Formik
        initialValues={ResetPasswordValues}
        validationSchema={ResetPasswordValidation}
        validateOnChange={false}
        onSubmit={({ password, code }, helpers) => onSubmit(password, code, helpers)}>
        {({ isSubmitting, isValid, dirty, status }) => (
          <Form className="space-y-6">
            <Field name="email">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...field} id="name" value={email} disabled={true} />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="code">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="code">Verification Code</FormLabel>
                  <Input {...field} id="code" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="password">New Password</FormLabel>
                  <Input {...field} id="password" type="password" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="passwordConfirmation">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="passwordConfirmation">Confirm New Password</FormLabel>
                  <Input {...field} id="passwordConfirmation" type="password" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <Link to={PageRoutes.SIGN_UP}>Sign Up</Link>
              </div>
              <div className="flex items-center justify-between">
                <Link to={PageRoutes.FORGOT_PASSWORD}>Didn't receive a code?</Link>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                colorScheme="cottage-green"
                className="focus:shadow-none"
                size="lg"
                isLoading={isSubmitting}
                disabled={!(isValid && dirty)}
                isFullWidth>
                Reset password
              </Button>
            </div>
            {status?.errorResponseMessage && (
              <Box mt={4}>
                <CottageAlert severity={AlertSeverity.ERROR}>
                  {status.errorResponseMessage}
                </CottageAlert>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
