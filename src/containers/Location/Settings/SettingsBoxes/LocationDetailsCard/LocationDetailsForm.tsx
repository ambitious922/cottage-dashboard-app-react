import React, { useContext, useRef } from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Textarea,
  Box,
} from '@chakra-ui/react';
import {
  LocationDetailsFormValidation,
  LocationDetailsFormValues,
} from './LocationDetailsFormField';
import { AppContext } from 'App';
import { UpdateLocationInput } from 'API';
import { useUpdateLocation } from 'api/query-hooks/location';
import { LocationErrors } from 'models/error';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

export interface LocationDetailsFormProps {
  onClose: () => void;
  shopName: string;
  shopDescription: string;
}

const LocationDetailsForm: React.FC<LocationDetailsFormProps> = ({
  onClose,
  shopName,
  shopDescription,
}) => {
  const { businessId, locationId } = useContext(AppContext);
  const cancelRef = useRef();

  const updateLocationMutation = useUpdateLocation();

  return (
    <Formik
      initialValues={{ shopName, shopDescription } || LocationDetailsFormValues}
      validationSchema={LocationDetailsFormValidation}
      onSubmit={async ({ shopName, shopDescription }, helpers) => {
        helpers.setStatus({ errorResponseMessage: '' });

        const input: UpdateLocationInput = {
          businessId,
          locationId,
          title: shopName,
          description: shopDescription,
        };
        try {
          await updateLocationMutation.mutateAsync(input);
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
      }}>
      {({ isValid, dirty, status }) => {
        return (
          <Form className="space-y-6 bg-white" style={{ minWidth: '100%' }}>
            <Field name="shopName">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel className="text-sm font-medium" htmlFor="shopName">
                    Shop Name
                  </FormLabel>
                  <Input
                    {...field}
                    id="shopName"
                    size="md"
                    width="full"
                    className="border-lightGreen-100"
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="shopDescription">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="shopDescription" className="text-sm font-medium">
                    Shop Description
                  </FormLabel>
                  <Textarea {...field} id="shopDescription" size="md" width="full" />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
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

export default LocationDetailsForm;
