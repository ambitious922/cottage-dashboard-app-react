import React, { useContext, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { PageRoutes } from 'constants/Routes';
import { SigninFormValidation, SignInFormValues } from './SignInFormFields';
import { FormControl, FormLabel, FormErrorMessage, Input, Button, Box } from '@chakra-ui/react';
import { getUserCredentials, getAttribute, resendCode, signIn, signOut } from 'api/auth';
import Link from 'components/Common/Link';
import { AmplifyErrors } from 'models/error';
import { AppContext } from 'App';
import ConfirmSignUpForm from '../ConfirmSignUpForm';
import { useCreateProducer, useGetProducerBusiness } from 'api/query-hooks/producer';
import { CreateProducerInput } from 'API';
import { useHistory } from 'react-router';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

interface SignInFormProps {}

const INITIAL_CODE_MESSAGE = 'Send another Code';
const POST_CODE_MESSAGE = 'Code sent!';

const COGNITO_CUSTOM_ATTR_FIRST_NAME = 'custom:firstName';
const COGNITO_CUSTOM_ATTR_LAST_NAME = 'custom:lastName';

const SignInForm: React.FC<SignInFormProps> = () => {
  const [identityId, setIdentityId] = useState<string | undefined>(undefined);
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [userNotFoundMessageVisible, setUserNotFoundMessageVisible] = useState(false);
  const [userNotConfirmedMessageVisible, setUserNotConfirmedMessageVisible] = useState(false);
  const [isConfirmSignUpVisible, setIsConfirmSignUpVisible] = useState(false);
  const [resendCodeFailed, setResendCodeFailed] = useState(false);
  const [signInFailed, setSignInFailed] = useState(false);
  const [isCreatingProducer, setIsCreatingProducer] = useState(false);
  const [sendCodeText, setSendCodeText] = useState(INITIAL_CODE_MESSAGE);
  const appContext = useContext(AppContext);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const createProducerMutation = useCreateProducer();

  // This is triggered after user clicks the sign in button and cognito APIs
  // are called to retrieve identity id.
  const getProducerBusinessQuery = useGetProducerBusiness(
    { id: identityId },
    {
      enabled: !!identityId,
      retry: false,
    }
  );

  const createProducerOnSignIn = async () => {
    try {
      const firstName = await getAttribute(COGNITO_CUSTOM_ATTR_FIRST_NAME);
      const lastName = await getAttribute(COGNITO_CUSTOM_ATTR_LAST_NAME);

      const producerData: CreateProducerInput = {
        producerId: identityId,
        email,
        firstName,
        lastName,
      };
      // TODO test sad paths here
      const res = await createProducerMutation.mutateAsync(producerData);
      appContext.setProducerId(res.data?.createProducer?.producer?.id || '');
      history.push(PageRoutes.ONBOARDING);
    } catch (e) {
      setSignInFailed(true);
    } finally {
      // creation failed so sign them out (just in case) and allow the user to retry
      await signOut();
      setIsCreatingProducer(false);
    }
  };

  // TODO tried to move to onSettled of useGetProducer hook and it wasnt getting triggered, try again later
  if (getProducerBusinessQuery.isSuccess) {
    // Confirmed there is no producer in our db, must be first time sign in, create them.
    // Note: this is safe because createProducer is idempotent
    if (!getProducerBusinessQuery.data.data?.producer && !isCreatingProducer && !signInFailed) {
      setIsCreatingProducer(true);
      createProducerOnSignIn();
    } else if (getProducerBusinessQuery.data.data?.producer) {
      appContext.setProducerId(getProducerBusinessQuery.data.data.producer.id);
      if (getProducerBusinessQuery.data.data.producer.business?.id) {
        appContext.setBusinessId(getProducerBusinessQuery.data.data.producer.business?.id);
      }

      if (getProducerBusinessQuery.data.data.producer.business) {
        history.push(
          `/business/${getProducerBusinessQuery.data.data.producer.business?.subdomain}/overview`
        );
      } else {
        history.push(PageRoutes.ONBOARDING);
      }
    }
  }

  const clearErrors = () => {
    setIncorrectCredentials(false);
    setUserNotFoundMessageVisible(false);
    setUserNotConfirmedMessageVisible(false);
    setResendCodeFailed(false);
    setSignInFailed(false);
  };

  const onSignIn = async (email: string, password: string) => {
    try {
      setEmail(email);
      clearErrors();
      await signIn(email, password);
      // deciding to use getUserCredentials.identityId but
      // this API has the same value in getCurrentUserInfo.id
      // const userInfo = await getCurrentUserInfo();
      const creds = await getUserCredentials();
      appContext.setProducerId(creds.identityId);
      setIdentityId(creds.identityId);
    } catch (e) {
      switch (e.code) {
        case AmplifyErrors.UsernameExistsException:
        case AmplifyErrors.NotAuthorizedException:
          setIncorrectCredentials(true);
          break;
        case AmplifyErrors.UserNotFoundException:
          setUserNotFoundMessageVisible(true);
          break;
        case AmplifyErrors.UserNotConfirmedException:
          setUserNotConfirmedMessageVisible(true);
          break;
        default:
          setSignInFailed(true);
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
        initialValues={SignInFormValues}
        validationSchema={SigninFormValidation}
        onSubmit={({ email, password }) => onSignIn(email, password)}>
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="space-y-6">
            <Field name="email">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...field} id="name" />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to={PageRoutes.FORGOT_PASSWORD}>Forgot your password?</Link>
              </div>

              <div className="flex items-center">
                <Link to={PageRoutes.SIGN_UP}>Sign Up</Link>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                colorScheme="cottage-green"
                size="lg"
                className="focus:outline-none focus:shadow-none"
                isLoading={isSubmitting || isCreatingProducer || getProducerBusinessQuery.isLoading}
                disabled={!(isValid && dirty)}
                isFullWidth>
                Sign in
              </Button>
            </div>
            {incorrectCredentials && (
              <Box mt={4}>
                <CottageAlert severity={AlertSeverity.ERROR}>
                  {
                    <div className="flex items-center justify-between text-red-500">
                      <span>Incorrect username or password.</span>
                    </div>
                  }
                </CottageAlert>
              </Box>
            )}
            {userNotFoundMessageVisible && (
              <Box mt={4}>
                <CottageAlert severity={AlertSeverity.ERROR}>
                  {
                    <div className="flex items-center justify-between text-red-500">
                      <span>We don't recognize this email. Sign up now to get started.</span>
                    </div>
                  }
                </CottageAlert>
              </Box>
            )}
            {/* Purposely not using the error container */}
            {userNotConfirmedMessageVisible && (
              <>
                <div className="flex items-center justify-between">
                  <span>
                    Please{' '}
                    <Button
                      variant="link"
                      colorScheme="cottage-green"
                      className="focus:outline-none focus:shadow-none"
                      onClick={() => setIsConfirmSignUpVisible(true)}>
                      {' '}
                      confirm this account
                    </Button>{' '}
                    with the code that was sent to your email.
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    Didn't receive an email?{' '}
                    <Button
                      variant="link"
                      colorScheme="cottage-green"
                      className="focus:outline-none focus:shadow-none"
                      onClick={() => onResendCode()}>
                      {sendCodeText}
                    </Button>
                  </span>
                </div>
              </>
            )}
            {signInFailed && (
              <Box mt={4}>
                <CottageAlert severity={AlertSeverity.ERROR}>
                  {
                    <div className="flex items-center justify-between text-red-500">
                      <span>Something went wrong, please try again.</span>
                    </div>
                  }
                </CottageAlert>
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
          </Form>
        )}
      </Formik>
      {isConfirmSignUpVisible && (
        <ConfirmSignUpForm
          email={email}
          onClose={() => {
            clearErrors();
            setIsConfirmSignUpVisible(false);
          }}
          onValidSignUp={() => null}
        />
      )}
    </>
  );
};

export default SignInForm;
