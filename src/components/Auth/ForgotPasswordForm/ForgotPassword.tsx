import React, { useState } from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import Link from 'components/Common/Link';
import { PageRoutes } from 'constants/Routes';
import {
  ForgotPasswordValidation,
  ForgotPasswordValues,
  IForgotPasswordFields,
} from './ForgotPasswordFields';
import { FormControl, FormLabel, FormErrorMessage, Input, Button, Box } from '@chakra-ui/react';

import { forgotPassword } from 'api/auth';
import { useHistory } from 'react-router';
import { AmplifyErrors } from 'models/error';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const history = useHistory();

  const onEmailProvided = async (email: string, helpers: FormikHelpers<IForgotPasswordFields>) => {
    helpers.setStatus({ errorResponseMessage: '' });
    try {
      await forgotPassword(email);
      history.push(PageRoutes.RESET_PASSWORD, { fromForgotPassword: true, email });
    } catch (e) {
      switch (e.code) {
        case AmplifyErrors.UserNotFoundException:
          break;
        default:
          helpers.setStatus({
            errorResponseMessage: 'Something went wrong, try again in a little while.',
          });
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
        initialValues={ForgotPasswordValues}
        validationSchema={ForgotPasswordValidation}
        validateOnChange={false}
        onSubmit={({ email }, helpers) => onEmailProvided(email, helpers)}>
        {({ isSubmitting, isValid, dirty, status }) => (
          <Form className="space-y-6">
            <Field name="email">
              {({ field, form }: FieldProps) => (
                <FormControl isInvalid={!!(form.errors.email && form.touched.email)}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...field} id="name" />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <div className="flex items-center justify-between">
              <Link to={PageRoutes.SIGN_UP}>Sign Up</Link>
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
                Send instructions
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

export default ForgotPassword;
