import React, { useContext, useRef } from 'react';
import { Formik, Form, Field, FieldProps, FormikHelpers } from 'formik';
import { FormControl, FormLabel, FormErrorMessage, Box, Button, Textarea } from '@chakra-ui/react';

import { CreateDeliveryInput, UpdateDeliveryInput } from 'API';
import { AppContext } from 'App';

import {
  CreateDeliveryFormFields,
  CreateDeliveryFormValidation,
  CreateDeliveryFormValues,
  DeliveryFormValues,
} from './DeliveryFormFields';
import { useCreateDelivery, useUpdateDelivery } from 'api/query-hooks/delivery';
import NumberFormat from 'react-number-format';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { DeliveryErrors } from 'models/error';

export interface DeliveryFormProps {
  deliveryId?: string;
  deliveryFormValues?: DeliveryFormValues;
  onClose: () => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ deliveryFormValues, deliveryId, onClose }) => {
  const { businessId, locationId } = useContext(AppContext);
  const cancelRef = useRef();

  const isEdit = !!deliveryFormValues;

  const createDelivery = useCreateDelivery();
  const updateDelivery = useUpdateDelivery();

  const convertPostalCodeStringToArray = (postalCodesStr: string) => {
    const x = postalCodesStr.charAt(-1) === ',' ? postalCodesStr.substring(0, -1) : postalCodesStr;
    return x.split(',')?.filter((y) => y.length === 5) || [];
  };

  const createDeliveryHelper = async (values: DeliveryFormValues) => {
    const castedValues = await CreateDeliveryFormValidation.validate(values);
    const { minimumTotal, fee, postalCodes } = castedValues;

    const input: CreateDeliveryInput = {
      businessId,
      locationId,
      minimumTotal,
      fee,
      postalCodes: convertPostalCodeStringToArray(postalCodes),
    };

    await createDelivery.mutateAsync(input);
    onClose();
  };

  const updateDeliveryHelper = async (values: DeliveryFormValues) => {
    if (!deliveryId) {
      return;
    }

    const castedValues = await CreateDeliveryFormValidation.validate(values);
    const { minimumTotal, fee, postalCodes } = castedValues;

    const input: UpdateDeliveryInput = {
      businessId,
      locationId,
      deliveryId,
      minimumTotal,
      fee,
      postalCodes: convertPostalCodeStringToArray(postalCodes),
    };

    await updateDelivery.mutateAsync(input);
    onClose();
  };

  const onSubmit = async (
    values: DeliveryFormValues,
    helpers: FormikHelpers<DeliveryFormValues>
  ) => {
    helpers.setStatus({ errorResponseMessage: '' });

    const valuesPostCentConversion = {
      ...values,
      minimumTotal: values.minimumTotal ? Math.round(values.minimumTotal * 100) : undefined,
      fee: values.fee ? Math.round(values.fee * 100) : undefined,
    };

    try {
      if (isEdit) {
        await updateDeliveryHelper(valuesPostCentConversion);
      } else {
        await createDeliveryHelper(valuesPostCentConversion);
      }
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case DeliveryErrors.DeliveryLimitExceededErrorCode:
          message =
            'Delivery rule limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        case DeliveryErrors.BusinessNotFoundErrorCode:
        case DeliveryErrors.DeliveryLimitExceededErrorCode:
        case DeliveryErrors.LocationNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      helpers.setStatus({ errorResponseMessage: message });
      helpers.setSubmitting(false);
    }
  };

  // convert the price from cents to dollars before displaying to the customer
  const initialMinimumTotal = deliveryFormValues?.minimumTotal
    ? deliveryFormValues.minimumTotal / 100
    : undefined;
  const initialFee = deliveryFormValues?.fee ? deliveryFormValues.fee / 100 : undefined;
  const deliveryWithDollarsFormValues = deliveryFormValues
    ? { ...deliveryFormValues, minimumTotal: initialMinimumTotal, fee: initialFee }
    : undefined;

  return (
    <Formik
      initialValues={deliveryWithDollarsFormValues || CreateDeliveryFormValues}
      onSubmit={(values, helpers) => onSubmit(values, helpers)}
      isInitialValid={isEdit}
      validateOnBlur={false}
      validationSchema={CreateDeliveryFormValidation}>
      {({ isValid, dirty, status }) => {
        return (
          <Form className="bg-white" style={{ minWidth: '100%' }}>
            <Box className="flex gap-6">
              <Field name="minimumTotal">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="minimumTotal" className="px-2 mb-1 text-sm font-medium">
                      {CreateDeliveryFormFields.minimumTotal}
                    </FormLabel>
                    <NumberFormat
                      {...field}
                      id="minimumTotal"
                      style={{ padding: '7px 16px' }}
                      className="border-lightGreen-100 rounded-md w-full"
                      decimalSeparator="."
                      displayType="input"
                      type="text"
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      placeholder={'$'}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="fee">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.error && meta.touched)}>
                    <FormLabel htmlFor="fee" className="px-2 mb-1 text-sm font-medium">
                      {CreateDeliveryFormFields.fee}
                    </FormLabel>
                    <NumberFormat
                      {...field}
                      id="fee"
                      style={{ padding: '7px 16px' }}
                      className="border-lightGreen-100 rounded-md w-full"
                      decimalSeparator="."
                      displayType="input"
                      type="text"
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      placeholder={'$'}
                    />
                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Field name="postalCodes">
              {({ field, meta }: FieldProps) => (
                <FormControl className="mt-6" on isInvalid={!!(meta.error && meta.touched)}>
                  <FormLabel htmlFor="description" className="px-2 mb-1 text-sm font-medium">
                    Zip codes
                    <span className="ml-1 text-xs font-normal text-grey"> (comma separated)</span>
                  </FormLabel>
                  <Textarea
                    {...field}
                    id="postalCodes"
                    size="md"
                    width="full"
                    className="border-lightGreen-100"
                    placeholder={'98027,98101,...'}
                  />
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Box className="mt-5">
              <Button
                colorScheme="cottage-green"
                height="56px"
                className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                type="submit"
                disabled={!(isValid && dirty)}
                isLoading={createDelivery.isLoading || updateDelivery.isLoading}>
                Create
              </Button>
              <Button
                height="36px"
                className="w-full mt-2 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
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

export default DeliveryForm;
