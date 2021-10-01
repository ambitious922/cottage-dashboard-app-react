import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
  Text,
  HStack,
  Box,
} from '@chakra-ui/react';
import { UpdateConsumerInput } from 'API';
import { AppContext } from 'App';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useContext, useRef } from 'react';
import {
  CustomerNoteFormValidation,
  CustomerNoteFormValues,
  ICustomerNoteFormValues,
} from './CustomerNoteFormFields';
import { useUpdateConsumerNote } from 'api/query-hooks/consumer';
import { ConsumerErrors } from 'models/error';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';

interface ICustomerNoteProps {
  firstName: string;
  lastName: string;
  consumerId: string;
  originalBusinessNote?: string;
  onClose: () => void;
}

const CustomerNoteForm: React.FC<ICustomerNoteProps> = ({
  firstName,
  lastName,
  consumerId,
  originalBusinessNote,
  onClose,
}) => {
  const { businessId } = useContext(AppContext);
  const updateConsumerMutation = useUpdateConsumerNote();
  const cancelRef = useRef();

  const onSubmit = async (
    values: ICustomerNoteFormValues,
    helpers: FormikHelpers<ICustomerNoteFormValues>
  ) => {
    helpers.setStatus({ errorResponseMessage: '' });

    const castedValues = await CustomerNoteFormValidation.validate(values);
    const { businessNote } = castedValues;

    const input: UpdateConsumerInput = {
      businessId,
      id: consumerId,
      businessNote: !businessNote || businessNote.length === 0 ? undefined : businessNote,
    };

    if (input.businessNote === originalBusinessNote) {
      onClose();
      return;
    }

    try {
      await updateConsumerMutation.mutateAsync(input);
      onClose();
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case ConsumerErrors.ConsumerNotFoundErrorCode:
        case ConsumerErrors.AccessForbiddenErrorCode:
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
          {firstName} {lastName}
        </Text>
      </HStack>
      <Formik
        initialValues={CustomerNoteFormValues}
        onSubmit={(values, helpers) => onSubmit(values, helpers)}
        validationSchema={CustomerNoteFormValidation}
        validateOnChange={false}
        validateOnBlur={false}>
        {({ isValid, dirty, status }) => (
          <Form>
            <Field name="businessNote">
              {({ field, form }: FieldProps) => (
                <FormControl
                  className="mt-4"
                  isInvalid={!!(form.errors.businessNote && form.touched.businessNote)}>
                  <FormLabel htmlFor="businessNote" className="mb-2 text-sm font-medium">
                    Description
                  </FormLabel>
                  <Textarea
                    {...field}
                    id="businessNote"
                    size="md"
                    width="full"
                    className="border-lightGreen-100"
                  />
                  <FormErrorMessage>{form.errors.businessNote}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Box className="block">
              <Button
                className="mt-4 w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                height="56px"
                type="submit"
                disabled={!(isValid && dirty)}
                isLoading={updateConsumerMutation.isLoading}>
                Save Note
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

export default CustomerNoteForm;
