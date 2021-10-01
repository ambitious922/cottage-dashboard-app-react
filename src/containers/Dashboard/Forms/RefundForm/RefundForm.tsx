import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
  Text,
  HStack,
  Divider,
  Box,
} from '@chakra-ui/react';
import { CreateOrderRefundInput, GetConsumerQuery, MonetaryValue } from 'API';
import { AppContext } from 'App';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useContext, useRef } from 'react';
import { displayableMonetaryValue } from 'utils';
import {
  CreateRefundFormValues,
  IRefundFormValues,
  RefundFormValidation,
} from './RefundFormFields';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

import NumberFormat from 'react-number-format';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { RefundErrors } from 'models/error';
import { useCreateOrderRefund } from 'api/query-hooks/refund';

interface IRefundFormProps {
  consumerFullName: string;
  consumerId: string;
  locationId: string;
  number: string;
  total?: MonetaryValue;
  orderId?: string;
  subscriptionInvoiceId?: string;
  onClose: () => void;
}

const RefundForm: React.FC<IRefundFormProps> = ({
  consumerFullName,
  consumerId,
  locationId,
  orderId,
  subscriptionInvoiceId,
  total,
  number,
  onClose,
}) => {
  const { businessId } = useContext(AppContext);
  const createOrderRefundMutation = useCreateOrderRefund();
  const cancelRef = useRef();

  const onSubmit = async (values: IRefundFormValues, helpers: FormikHelpers<IRefundFormValues>) => {
    helpers.setStatus({ errorResponseMessage: '' });

    const valuesPostCentConversion = {
      ...values,
      amount: values.amount ? Math.round(values.amount * 100) : undefined,
    };

    const castedValues = await RefundFormValidation.validate(valuesPostCentConversion);
    const { amount, description } = castedValues;

    try {
      if (orderId) {
        const input: CreateOrderRefundInput = {
          businessId,
          locationId,
          orderId,
          consumerId,
          amount,
          description: !description || description.length === 0 ? undefined : description,
        };

        await createOrderRefundMutation.mutateAsync(input);
        onClose();
      }
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case RefundErrors.RefundAmountExceededErrorCode:
          message = 'You can only refund up to the total spent.';
          break;
        case RefundErrors.BusinessNotFoundErrorCode:
        case RefundErrors.ConsumerNotFoundErrorCode:
        case RefundErrors.LocationNotFoundErrorCode:
        case RefundErrors.OrderNotFoundErrorCode:
        case RefundErrors.OrderNotPaidErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      helpers.setStatus({ errorResponseMessage: message });
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <HStack spacing="24px">
        <Text className="text-sm font-medium" width="130px">
          Customer
        </Text>
        <Text className="text-sm">{consumerFullName}</Text>
      </HStack>
      <HStack spacing="24px" marginTop="10px" marginBottom="22px">
        <Text className="text-sm font-medium" width="130px">
          Type
        </Text>
        <Text className="text-sm">{orderId ? 'Order' : 'Susbcription Invoice'}</Text>
      </HStack>
      <Divider />
      <HStack spacing="24px" marginTop="22px">
        <Text className="text-sm font-medium" width="130px">
          {orderId ? 'Order No.' : 'Subscription No.'}
        </Text>
        <Text className="text-sm">{number}</Text>
      </HStack>
      <HStack spacing="24px" marginTop="10px" marginBottom="22px">
        <Text className="text-sm font-medium" width="130px">
          Total
        </Text>
        <Text className="text-sm">{displayableMonetaryValue(total)}</Text>
      </HStack>
      <Formik
        initialValues={CreateRefundFormValues}
        onSubmit={(values, helpers) => onSubmit(values, helpers)}
        validationSchema={RefundFormValidation}
        validateOnBlur={false}>
        {({ isValid, dirty, status }) => (
          <Form>
            <Field name="amount">
              {({ field, form }: FieldProps) => (
                <FormControl
                  className="my-6 flex"
                  spacing="24px"
                  isInvalid={!!(form.errors.amount && form.touched.amount)}>
                  <FormLabel
                    htmlFor="price"
                    className="mb-1 pt-3 text-sm font-medium"
                    width="142px">
                    Amount
                  </FormLabel>
                  <Box>
                    <NumberFormat
                      {...field}
                      id="amount"
                      style={{ padding: '7px 16px' }}
                      className="border-lightGreen-100 rounded-md w-full"
                      decimalSeparator="."
                      displayType="input"
                      type="text"
                      allowNegative={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      placeholder={'$'}
                    />
                    <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                  </Box>
                </FormControl>
              )}
            </Field>
            <Field name="description">
              {({ field, form }: FieldProps) => (
                <FormControl
                  className="mt-4"
                  isInvalid={!!(form.errors.description && form.touched.description)}>
                  <FormLabel htmlFor="description" className="px-2 mb-1 text-sm font-medium">
                    Description{' '}
                    <span className="ml-1 text-xs font-normal text-grey">(optional)</span>
                  </FormLabel>
                  <Textarea
                    {...field}
                    id="description"
                    size="md"
                    width="full"
                    className="border-lightGreen-100"
                  />
                  <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Box className="mt-5">
              <Button
                className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                height="56px"
                type="submit"
                isLoading={createOrderRefundMutation.isLoading}
                disabled={!(isValid && dirty)}>
                Apply Refund
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
        )}
      </Formik>
    </>
  );
};

export default RefundForm;
