import React, { useContext, useRef } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';
import { useCreateBusinessBankAccount } from 'api/query-hooks/bankAccount';
import { BusinessType } from 'API';
import { StripeCreateBusinessAccountParams } from 'api/query-functions/bankAccount';
import { AppContext } from 'App';
import { useStripe } from '@stripe/react-stripe-js';
import { Spinner } from 'components/Common/Spinner/Spinner';
import { BankAccountFormValues, BankAccountFormValidation } from './BankAccountFormFields';
import { LockClosedIcon } from '@heroicons/react/outline';
import { BankAccountErrors } from 'models/error';
import CottageAlert, { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

export interface BusinessBankAccountFormProps {
  onClose: () => void;
  businessType: BusinessType;
}

const BankAccountForm: React.FC<BusinessBankAccountFormProps> = ({ onClose, businessType }) => {
  const cancelRef = useRef();
  const { businessId } = useContext(AppContext);
  const createBusinessBankAccountMutation = useCreateBusinessBankAccount();
  const stripe = useStripe();

  if (stripe === null) {
    return <Spinner />;
  }

  return (
    <Formik
      initialValues={BankAccountFormValues}
      onSubmit={async ({ accountHolderName, accountNumber, routingNumber }, helpers) => {
        helpers.setStatus({ errorResponseMessage: '' });

        const input: StripeCreateBusinessAccountParams = {
          businessId,
          businessType,
          stripe,
          createBusinessBankAccountFormData: {
            accountHolderName,
            // TODO may not be the best approach but it works :(
            accountNumber: accountNumber || 0,
            routingNumber: routingNumber || 0,
          },
        };
        try {
          await createBusinessBankAccountMutation.mutateAsync(input);
        } catch (e) {
          const exception = e?.errors[0];
          const code = exception.extensions?.code;
          let message;
          switch (code) {
            case BankAccountErrors.StripeInvalidAccountErrorCode:
              message =
                'Unable to verify this bank account, verify you typed it in correctly and try again.';
              break;
            case BankAccountErrors.BusinessNotFoundErrorCode:
            default:
              message = 'Something went wrong';
              break;
          }
          helpers.setStatus({ errorResponseMessage: message });
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={BankAccountFormValidation}
      validateOnChange={false}
      validateOnBlur={false}>
      {({ isValid, dirty, status }) => {
        return (
          <Form className="space-y-4 bg-white" style={{ minWidth: '100%' }}>
            <Field name="accountHolderName">
              {({ field, form }: FieldProps) => (
                <FormControl
                  isInvalid={!!(form.errors.accountHolderName && form.touched.accountHolderName)}>
                  <FormLabel
                    htmlFor="accountHolderName"
                    fontSize="14px"
                    fontWeight="500"
                    className="px-2 mt-4">
                    Account Holder Name
                  </FormLabel>
                  <Input
                    {...field}
                    id="accountHolderName"
                    size="md"
                    width="100%"
                    className="border-lightGreen-100"
                  />
                  <FormErrorMessage>{form.errors.accountHolderName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <div className="flex items-center gap-6 my-2">
              <Field name="routingNumber">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    isInvalid={!!(form.errors.routingNumber && form.touched.routingNumber)}>
                    <FormLabel
                      htmlFor="routingNumber"
                      fontSize="14px"
                      fontWeight="500"
                      className="px-2">
                      Routing Number
                    </FormLabel>
                    <Input
                      {...field}
                      id="routingNumber"
                      size="md"
                      width="100%"
                      className="border-lightGreen-100"
                    />
                    <FormErrorMessage>{form.errors.routingNumber}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="accountNumber">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    isInvalid={!!(form.errors.accountNumber && form.touched.accountNumber)}>
                    <FormLabel
                      htmlFor="accountNumber"
                      fontSize="14px"
                      fontWeight="500"
                      className="px-2">
                      Account Number
                    </FormLabel>
                    <Input
                      {...field}
                      id="accountNumber"
                      size="md"
                      width="100%"
                      className="border-lightGreen-100"
                    />
                    <FormErrorMessage>{form.errors.accountNumber}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </div>
            <div className="flex items-center gap-4 text-grey py-2">
              <LockClosedIcon className="w-8 h-8" />
              <Text className="text-sm font-medium">
                Cottage works with industry-leading partners to ensure secure payments and PCI
                compliance.
              </Text>
            </div>
            <div>
              <Box className="block">
                <Button
                  isLoading={createBusinessBankAccountMutation.isLoading}
                  colorScheme="cottage-green"
                  className="text-sm font-semibold w-full focus:outline-none focus:shadow-none"
                  height="56px"
                  type="submit"
                  disabled={!(isValid && dirty)}>
                  Save Bank Account
                </Button>
                <Button
                  height="36px"
                  className="w-full mt-3 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
                  ref={cancelRef.current}
                  onClick={onClose}>
                  Close
                </Button>
                {status?.errorResponseMessage && (
                  <Box mt={4}>
                    <CottageAlert severity={AlertSeverity.ERROR}>
                      {status.errorResponseMessage}
                    </CottageAlert>
                  </Box>
                )}
              </Box>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BankAccountForm;
