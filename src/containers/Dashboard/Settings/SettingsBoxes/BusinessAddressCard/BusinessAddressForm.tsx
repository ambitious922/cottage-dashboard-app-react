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
import { CountryCode, StateOrProvince, UpdateBusinessInput } from 'API';
import { AddressFormValidation } from 'utils/validation';
import { AppContext } from 'App';
import { useUpdateBusiness } from 'api/query-hooks/business';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { BusinessErrors } from 'models/error';
export interface IBusinessAddressFormProps {
  onClose: () => void;
  disabled: boolean;
  stateOrProvince: StateOrProvince;
  country: CountryCode;
  postalCode: string;
  street: string;
  street2: string;
  city: string;
}

const BusinessAddressForm: React.FC<IBusinessAddressFormProps> = ({
  onClose,
  disabled,
  street,
  street2,
  stateOrProvince,
  country,
  city,
  postalCode,
}) => {
  const { producerId, businessId } = useContext(AppContext);
  const cancelRef = useRef();
  const updateBusinessMutation = useUpdateBusiness();

  return (
    <Formik
      initialValues={{
        street,
        street2,
        postalCode,
        country,
        stateOrProvince,
        city,
      }}
      validationSchema={AddressFormValidation}
      onSubmit={async (
        { street, street2, city, postalCode, country, stateOrProvince },
        helpers
      ) => {
        console.log('helloworld');
        helpers.setStatus({ errorResponseMessage: '' });

        const input: UpdateBusinessInput = {
          address: {
            street,
            street2: street2 || undefined,
            city,
            stateOrProvince: stateOrProvince,
            country,
            postalCode,
          },
          businessId,
          producerId,
        };
        try {
          await updateBusinessMutation.mutateAsync(input);
          onClose();
        } catch (e) {
          console.log(e);
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
      {({ isValid, dirty, status, errors }) => {
        return (
          <Form className="space-y-6 bg-white" style={{ minWidth: '100%' }}>
            <Field name="street">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="street" fontSize="14px" fontWeight="500" className="px-2">
                    Street Address
                  </FormLabel>
                  {disabled ? (
                    <Text className="text-sm px-2">{field.value}</Text>
                  ) : (
                    <Input
                      {...field}
                      id="street"
                      size="md"
                      width="full"
                      className="border-lightGreen-100"
                    />
                  )}
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="street2">
              {({ field, meta }: FieldProps) => (
                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="street2" fontSize="14px" fontWeight="500" className="px-2">
                    Street 2
                  </FormLabel>
                  {disabled ? (
                    <Text className="text-sm px-2">{field.value}</Text>
                  ) : (
                    <Input
                      {...field}
                      id="street2"
                      size="md"
                      width="full"
                      className="border-lightGreen-100"
                    />
                  )}
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <div className="flex items-center gap-6 my-2">
              <Field name="city">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="city" fontSize="14px" fontWeight="500" className="px-2">
                      City
                    </FormLabel>
                    {disabled ? (
                      <Text className="text-sm px-2">{field.value}</Text>
                    ) : (
                      <Input
                        {...field}
                        id="city"
                        size="md"
                        width="full"
                        className="border-lightGreen-100"
                      />
                    )}
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="postalCode">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel
                      htmlFor="postalCode"
                      fontSize="14px"
                      fontWeight="500"
                      className="px-2">
                      Zip Code
                    </FormLabel>
                    {disabled ? (
                      <Text className="text-sm px-2">{field.value}</Text>
                    ) : (
                      <Input
                        {...field}
                        id="postalCode"
                        size="md"
                        width="full"
                        className="border-lightGreen-100"
                      />
                    )}
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </div>
            <div className="flex items-center gap-6 my-2">
              <Field name="stateOrProvince">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel
                      htmlFor="stateOrProvince"
                      fontSize="14px"
                      fontWeight="500"
                      className="px-2">
                      State
                    </FormLabel>
                    {disabled ? (
                      <Text className="text-sm px-2">{field.value}</Text>
                    ) : (
                      <Input
                        {...field}
                        id="stateOrProvince"
                        size="md"
                        width="full"
                        className="border-lightGreen-100"
                      />
                    )}
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="country">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="country" fontSize="14px" fontWeight="500" className="px-2">
                      Country
                    </FormLabel>
                    {disabled ? (
                      <Text className="text-sm px-2">{field.value}</Text>
                    ) : (
                      <Input
                        {...field}
                        id="country"
                        size="md"
                        width="full"
                        className="border-lightGreen-100"
                      />
                    )}
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </div>
            <Box className="block">
              <Button
                isLoading={updateBusinessMutation.isLoading}
                colorScheme="cottage-green"
                height="56px"
                className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                disabled={!(isValid && dirty)}
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

export default BusinessAddressForm;
