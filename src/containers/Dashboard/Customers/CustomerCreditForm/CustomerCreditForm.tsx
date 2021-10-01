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
import { CreateCreditInput, GetConsumerQuery } from 'API';
import { useCreateCredit } from 'api/query-hooks/credit';
import { AppContext } from 'App';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useContext, useRef } from 'react';
import { displayableMonetaryValue } from 'utils';
import {
  CreateCreditFormValues,
  CreditFormValidation,
  ICreditFormValues,
} from './CustomerCreditFormFields';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

import NumberFormat from 'react-number-format';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { CreditErrors } from 'models/error';

interface ICustomerManageCreditProps {
  consumerQueryResponse: GetConsumerQuery;
  onClose: () => void;
}

const CustomerCreditForm: React.FC<ICustomerManageCreditProps> = ({
  consumerQueryResponse,
  onClose,
}) => {
  const { businessId } = useContext(AppContext);
  const createCreditMutation = useCreateCredit();
  const cancelRef = useRef();

  if (!consumerQueryResponse.getConsumer) {
    return <div>Something went wrong, try again later.</div>;
  }

  const consumer = consumerQueryResponse.getConsumer;

  const onSubmit = async (values: ICreditFormValues, helpers: FormikHelpers<ICreditFormValues>) => {
    helpers.setStatus({ errorResponseMessage: '' });

    const valuesPostCentConversion = {
      ...values,
      amount: values.amount ? Math.round(values.amount * 100) : undefined,
    };

    const castedValues = await CreditFormValidation.validate(valuesPostCentConversion);
    const { amount, description } = castedValues;

    const input: CreateCreditInput = {
      businessId,
      consumerId: consumer.id,
      amount,
      description: !description || description.length === 0 ? undefined : description,
    };

    try {
      await createCreditMutation.mutateAsync(input);
      onClose();
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case CreditErrors.ConsumerUpdateCreditBalanceRetryErrorCode:
          message = `Looks like ${consumer.firstName}'s credits were altered, refresh the page and try again.`;
          break;
        case CreditErrors.CreditAmountInvalidErrorCode:
          message =
            'You have exceeded the total amount that can be debited from this customer. If this looks like a mistake refresh the page to see the latest credit balance.';
          break;
        case CreditErrors.BusinessNotFoundErrorCode:
        case CreditErrors.ConsumerNotFoundErrorCode:
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
        <Text className="text-sm">
          {consumer.firstName} {consumer.lastName}
        </Text>
      </HStack>
      <HStack spacing="24px" marginTop="10px" marginBottom="22px">
        <Text className="text-sm font-medium" width="130px">
          Account Balance
        </Text>
        <Text className="text-sm">{displayableMonetaryValue(consumer.creditBalance)}</Text>
      </HStack>
      <Divider />
      <Formik
        initialValues={CreateCreditFormValues}
        onSubmit={(values, helpers) => onSubmit(values, helpers)}
        validationSchema={CreditFormValidation}
        validateOnChange={false}
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
            <Box
              className="flex items-center gap-4 p-3 rounded-lg"
              style={{ background: '#FCF9E9' }}>
              <div>
                <QuestionMarkCircleIcon className="text-black h-6 w-6" />
              </div>
              <span className="text-sm text-gray-500">
                Entering a negative number will deduct from the account balance.
              </span>
            </Box>
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
            <Box className="block">
              <Button
                className="mt-4 w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                height="56px"
                type="submit"
                isLoading={createCreditMutation.isLoading}
                disabled={!(isValid && dirty)}>
                Apply Credit
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
        )}
      </Formik>
    </>
  );
};

export default CustomerCreditForm;
