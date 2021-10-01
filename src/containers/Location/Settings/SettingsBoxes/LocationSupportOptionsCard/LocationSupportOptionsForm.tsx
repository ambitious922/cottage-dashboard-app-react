import React, { useContext, useRef, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { FormControl, FormLabel, FormErrorMessage, Input, Button, Box } from '@chakra-ui/react';
import {
  LocationSupportOptionsFormValidation,
  LocationSupportOptionsFormValues,
} from './LocationSupportOptionsFormField';
import PhoneInput from 'react-phone-number-input/input';
import { AppContext } from 'App';
import { useUpdateLocation } from 'api/query-hooks/location';
import { UpdateLocationInput } from 'API';
import { LocationErrors } from 'models/error';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

export interface LocationDetailsFormProps {
  onClose: () => void;
  supportPhoneNumber: string;
  supportEmail: string;
}

const LocationSupportOptionsForm: React.FC<LocationDetailsFormProps> = ({
  onClose,
  supportEmail,
  supportPhoneNumber,
}) => {
  const { businessId, locationId } = useContext(AppContext);
  const cancelRef = useRef();
  const [phoneValue, setPhoneValue] = useState<string | undefined>(supportPhoneNumber);

  const updateLocationMutation = useUpdateLocation();

  return (
    <Formik
      initialValues={{ supportPhoneNumber, supportEmail } || LocationSupportOptionsFormValues}
      onSubmit={async ({ supportEmail, supportPhoneNumber }, helpers) => {
        helpers.setStatus({ errorResponseMessage: '' });

        const input: UpdateLocationInput = {
          businessId,
          locationId,
          // allow removal of these values
          supportPhoneNumber: supportEmail || null,
          supportEmail: supportPhoneNumber || null,
        };
        try {
          const res = await updateLocationMutation.mutateAsync(input);
          console.log(res);
          onClose();
        } catch (e) {
          const exception = e?.errors[0];
          const code = exception.extensions?.code;
          let message;
          switch (code) {
            case LocationErrors.BusinessNotFoundErrorCode:
            case LocationErrors.LocationNotFoundErrorCode:
            default:
              message = 'Something went wrong';
              break;
          }
          helpers.setStatus({ errorResponseMessage: message });
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={LocationSupportOptionsFormValidation}>
      {({ isValid, dirty, status, setFieldValue }) => {
        return (
          <Form className="space-y-6 bg-white" style={{ minWidth: '100%' }}>
            <Field name="supportPhoneNumber">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.touched && meta.error)}>
                  <FormLabel htmlFor="supportPhoneNumber" className="text-sm font-medium">
                    Support Phone
                  </FormLabel>
                  <PhoneInput
                    {...field}
                    id="supportPhoneNumber"
                    style={{ height: '40px' }}
                    className="border-lightGreen-100 rounded-md w-full px-4 py-1.5"
                    defaultCountry="US"
                    value={phoneValue}
                    onChange={(e) => {
                      setPhoneValue(e);
                      setFieldValue('supportPhoneNumber', e);
                    }}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="supportEmail">
              {({ field, form }: FieldProps) => (
                <FormControl isInvalid={!!(form.errors.supportEmail && form.touched.supportEmail)}>
                  <FormLabel htmlFor="supportEmail" className="text-sm font-medium">
                    Support E-mail
                  </FormLabel>
                  <Input
                    {...field}
                    id="supportEmail"
                    size="md"
                    width="full"
                    className="border-lightGreen-100"
                  />
                  <FormErrorMessage>{form.errors.supportEmail}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box className="block">
              <Button
                disabled={!(isValid && dirty)}
                isLoading={updateLocationMutation.isLoading}
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

export default LocationSupportOptionsForm;
