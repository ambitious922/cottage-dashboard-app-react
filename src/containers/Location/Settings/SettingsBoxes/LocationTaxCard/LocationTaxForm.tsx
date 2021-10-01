import React, { useContext, useRef } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  Button,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
} from '@chakra-ui/react';
import { AppContext } from 'App';
import { useUpdateTaxRate } from 'api/query-hooks/taxRate';
import { TaxRate, TaxType } from 'API';
import {
  LocationDetailsFormTaxValidation,
  LocationDetailsTaxFormValues,
} from './LocationTaxFormField';
import { percentParse } from 'utils';
import { TaxRateErrors } from 'models/error';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

export interface LocationDetailsFormProps {
  onClose: () => void;
  taxRate: TaxRate;
}

const LocationDetailsTaxForm: React.FC<LocationDetailsFormProps> = ({ taxRate, onClose }) => {
  const cancelRef = useRef();
  const { businessId, locationId } = useContext(AppContext);

  const updateTaxRateMutation = useUpdateTaxRate();

  const onSubmit = async (rate: number) => {
    // For some reason this is required because the rate value isn't actually a number
    const convertedRate = +rate / 100;

    try {
      if (rate !== taxRate.rate) {
        const res = await updateTaxRateMutation.mutateAsync({
          businessId,
          locationId,
          rate: convertedRate,
          type: TaxType.SALES_TAX,
        });
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik
      initialValues={{ taxPercentage: taxRate.rate * 100 } || LocationDetailsTaxFormValues}
      validationSchema={LocationDetailsFormTaxValidation}
      onSubmit={async ({ taxPercentage }, helpers) => {
        helpers.setStatus({ errorResponseMessage: '' });

        // For some reason this is required because the rate value isn't actually a number
        const convertedRate = +taxPercentage / 100;

        try {
          if (taxPercentage !== taxRate.rate) {
            await updateTaxRateMutation.mutateAsync({
              businessId,
              locationId,
              rate: convertedRate,
              type: TaxType.SALES_TAX,
            });
            onClose();
          }
        } catch (e) {
          console.error(e);
          const exception = e?.errors[0];
          const code = exception.extensions?.code;
          let message;
          switch (code) {
            case TaxRateErrors.BusinessNotFoundErrorCode:
            case TaxRateErrors.LocationNotFoundErrorCode:
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
            <div className="flex items-center my-2 gap-9">
              <Field name="taxPercentage">
                {({ field, form, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <HStack>
                      <Box>
                        <FormLabel
                          htmlFor="taxPercentage"
                          className="inline text-sm font-medium whitespace-nowrap">
                          Collect Sales Tax (%)
                        </FormLabel>
                      </Box>
                      <Box>
                        <NumberInput
                          size="md"
                          width="115px"
                          min={0}
                          max={100}
                          precision={2}
                          name={field.name}
                          value={field.value}
                          focus="false"
                          placeholder="%"
                          onChange={(e) => form.setFieldValue(field.name, percentParse(e))}>
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        {meta.error && (
                          <span className="inline-block ml-2 text-sm text-red-500">
                            {meta.error}
                          </span>
                        )}
                      </Box>
                    </HStack>
                  </FormControl>
                )}
              </Field>
            </div>
            <Box className="block">
              <Button
                disabled={!(isValid && dirty)}
                isLoading={updateTaxRateMutation.isLoading}
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

export default LocationDetailsTaxForm;
