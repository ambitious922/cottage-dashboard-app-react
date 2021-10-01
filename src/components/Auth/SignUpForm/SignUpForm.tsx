import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import { FormControl, FormLabel, FormErrorMessage, Input, Button, Box } from '@chakra-ui/react';
import Link from 'components/Common/Link';
import { PageRoutes } from 'constants/Routes';
import { signUp, resendCode, signOut } from 'api/auth';
import { AmplifyErrors } from 'models/error';
import { SignUpFormValues, SignUpFormValidation } from './SignUpFormFields';
import ConfirmSignUpForm from '../ConfirmSignUpForm';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

interface SignUpFormProps {}

const INITIAL_CODE_MESSAGE = 'Resend';
const POST_CODE_MESSAGE = 'Code sent!';

const SignUpForm: React.FC<SignUpFormProps> = ({}) => {
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const [isConfirmSignUpVisible, setIsConfirmSignUpVisible] = useState(false);
  const [resendCodeFailed, setResendCodeFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sendCodeText, setSendCodeText] = useState(INITIAL_CODE_MESSAGE);
  const [email, setEmail] = useState('');
  const history = useHistory();

  const clearErrors = () => {
    setUserAlreadyExists(false);
    setResendCodeFailed(false);
    setErrorMessage('');
  };

  const onSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    clearErrors();
    setIsConfirmSignUpVisible(false);

    try {
      await signOut();
      setEmail(email);
      await signUp(email, password, firstName, lastName);
      setIsConfirmSignUpVisible(true);
    } catch (e) {
      switch (e.code) {
        case AmplifyErrors.UsernameExistsException:
          setUserAlreadyExists(true);
          break;
        case AmplifyErrors.TooManyFailedAttemptsException:
          setErrorMessage('Too many failed attempts, try again in a little while.');
          break;
        case AmplifyErrors.TooManyRequestsException:
          setErrorMessage('Too many requests were made, try again in a little while.');
          break;
        default:
          setErrorMessage('Something went wrong, please try again.');
          break;
      }
    }
  };

  const onResendCode = async () => {
    if (email) {
      // reset this
      setResendCodeFailed(false);

      // we already sent the link, they are attempting to repeatedly call
      // cognito so bail early to prevent cognito throttle
      if (sendCodeText === POST_CODE_MESSAGE) {
        return;
      }

      try {
        await resendCode(email);
        setSendCodeText(POST_CODE_MESSAGE);
      } catch (e) {
        switch (e.code) {
          default:
            setResendCodeFailed(true);
            break;
        }
      }
    }
  };

  const onValidSignUp = async () => {
    // Customer has to manually sign in, we will create them in the db on first sign in
    // We cannot auto signin because amplify if kind of lame (https://github.com/aws-amplify/amplify-js/issues/991)
    history.push(PageRoutes.SIGN_IN);
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
        initialValues={SignUpFormValues}
        validationSchema={SignUpFormValidation}
        onSubmit={({ email, password, firstName, lastName }) =>
          onSignUp(email, password, firstName, lastName)
        }>
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-2 gap-x-4">
              <Field name="firstName">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Input {...field} id="firstName" />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="lastName">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Input {...field} id="lastName" />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </div>
            <Field name="email">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...field} id="email" type="email" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input {...field} id="password" type="password" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="passwordConfirmation">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="passwordConfirmation">Confirm Password</FormLabel>
                  <Input {...field} id="passwordConfirmation" type="password" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <div className="flex items-center justify-between">
              <span>Already have an account?</span>
              <div className="flex items-center">
                <Link to={PageRoutes.SIGN_IN}> Sign In</Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                colorScheme="cottage-green"
                className="focus:outline-none focus:shadow-none"
                size="lg"
                isLoading={isSubmitting}
                disabled={!(isValid && dirty)}
                isFullWidth>
                Sign Up
              </Button>
            </div>

            {/* Purposely not using the error container */}
            {userAlreadyExists && (
              <>
                <div className="flex items-center justify-between">
                  <span>A user with that email exists. Already have a confirmation code?</span>
                  <div className="flex items-center">
                    {/* TODO: confirm page route */}
                    <Button
                      variant="link"
                      colorScheme="cottage-green"
                      className="focus:outline-none focus:shadow-none"
                      onClick={() => setIsConfirmSignUpVisible(true)}>
                      {' '}
                      Confirm
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Need another code?</span>
                  <div className="flex items-center">
                    {/* TODO: confirm page route */}
                    <Button
                      variant="link"
                      colorScheme="cottage-green"
                      className="focus:outline-none focus:shadow-none"
                      onClick={onResendCode}>
                      {' '}
                      {sendCodeText}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {errorMessage && (
              <Box mt={4}>
                <CottageAlert severity={AlertSeverity.ERROR}>{errorMessage}</CottageAlert>
              </Box>
            )}
            {resendCodeFailed && (
              <Box mt={4}>
                <CottageAlert severity={AlertSeverity.ERROR}>
                  {
                    <div className="flex items-center justify-between text-red-500">
                      <span>
                        Looks like we had an issue sending the new code, please refresh and try
                        again in a little bit.
                      </span>
                    </div>
                  }
                </CottageAlert>
              </Box>
            )}
            {isConfirmSignUpVisible && (
              <ConfirmSignUpForm
                email={email}
                onClose={() => setIsConfirmSignUpVisible(false)}
                onValidSignUp={onValidSignUp}
              />
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUpForm;
