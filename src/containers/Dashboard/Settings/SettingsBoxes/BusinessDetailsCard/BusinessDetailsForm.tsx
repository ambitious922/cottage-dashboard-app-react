import React, { useState, useRef, useContext } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  HStack,
  Box,
} from '@chakra-ui/react';
import { BusinessStatus, UpdateBusinessInput } from 'API';
import { BusinessDetailsFormValidation } from './BusinessDetailsFormFields';
import { AppContext } from 'App';
import { useUpdateBusiness } from 'api/query-hooks/business';

import PhoneInput from 'react-phone-number-input/input';
import CottageTooltip from 'components/Common/CottageTooltip';
import { BusinessErrors } from 'models/error';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

export interface BusinessDetailsFormProps {
  onClose: () => void;
  businessName: string;
  businessUrl: string;
  status: BusinessStatus;
  email: string;
  phoneNumber: string;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  onClose,
  businessName,
  businessUrl,
  status,
  email,
  phoneNumber,
}) => {
  const { businessId, producerId } = useContext(AppContext);
  const cancelRef = useRef();

  const updateBusinessMutation = useUpdateBusiness();
  const [phoneValue, setPhoneValue] = useState<string | undefined>(phoneNumber);

  return (
    <Formik
      initialValues={{
        businessName,
        businessUrl,
        businessStatus: status,
        phoneNumber,
        email,
      }}
      validationSchema={BusinessDetailsFormValidation}
      onSubmit={async ({ email }, helpers) => {
        helpers.setStatus({ errorResponseMessage: '' });

        const input: UpdateBusinessInput = {
          businessId,
          producerId,
          phoneNumber: phoneValue,
          email,
        };
        try {
          await updateBusinessMutation.mutateAsync(input);
          onClose();
        } catch (e) {
          const exception = e?.errors[0];
          const code = exception.extensions?.code;
          let message;
          switch (code) {
            case BusinessErrors.BusinessNotFoundErrorCode:
            default:
              message = 'Something went wrong';
              break;
          }
          helpers.setStatus({ errorResponseMessage: message });
          helpers.setSubmitting(false);
        }
      }}>
      {({ isValid, dirty, status, setFieldValue }) => {
        return (
          <Form className="space-y-6 bg-white" style={{ minWidth: '100%' }}>
            <Field name="businessName">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel
                    htmlFor="businessName"
                    fontSize="14px"
                    fontWeight="500"
                    className="px-2">
                    Business Name
                  </FormLabel>
                  <Text className="text-sm font-semibold px-2">{field.value}</Text>
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="businessUrl">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel
                    htmlFor="businessUrl"
                    fontSize="14px"
                    fontWeight="500"
                    className="flex items-center gap-1.5 mb-1 px-2 text-sm font-medium">
                    Business Url&nbsp;
                    <CottageTooltip text="Your free cottage domain. We can mask this with your personal website later just reach out to us." />
                  </FormLabel>
                  <Text className="text-sm px-2">{field.value}</Text>
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="businessStatus">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <HStack className="flex items-center">
                    <FormLabel
                      htmlFor="businessUrl"
                      fontSize="14px"
                      fontWeight="500"
                      className="px-2 m-0">
                      Business Status
                    </FormLabel>
                    <Text
                      fontSize="14px"
                      fontWeight="500"
                      className="text-lightGreen-100 text-italic">
                      Active
                    </Text>
                  </HStack>
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <div className="flex gap-6 my-2">
              <Field name="phoneNumber">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel
                      htmlFor="phoneNumber"
                      fontSize="14px"
                      fontWeight="500"
                      className="px-2">
                      Phone Number
                    </FormLabel>
                    <PhoneInput
                      {...field}
                      id="phoneNumber"
                      style={{ height: '40px' }}
                      className="border-lightGreen-100 rounded-md w-full px-4 py-1.5"
                      defaultCountry="US"
                      value={phoneValue}
                      onChange={(e) => {
                        setPhoneValue(e);
                        setFieldValue('phoneNumber', e);
                      }}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="email">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="email" fontSize="14px" fontWeight="500" className="px-2">
                      Email
                    </FormLabel>
                    <Input
                      {...field}
                      id="email"
                      size="md"
                      width="full"
                      className="border-lightGreen-100"
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </div>
            <Box className="mt-5">
              <Button
                disabled={!(isValid && dirty)}
                isLoading={updateBusinessMutation.isLoading}
                colorScheme="cottage-green"
                height="56px"
                className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                type="submit">
                Save Changes
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default BusinessDetailsForm;
