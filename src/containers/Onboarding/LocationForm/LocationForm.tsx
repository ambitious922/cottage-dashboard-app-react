import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Box,
  Text,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { ChevronLeftIcon, LinkIcon } from '@heroicons/react/outline';
import { CreateLocationInput, LocationStatus } from 'API';
import { useCreateLocation } from 'api/query-hooks/location';
import { AppContext } from 'App';
import { Params } from 'constants/Routes';
import { Field, FieldProps, Form, Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { percentParse } from 'utils';
import { handleUrlChange } from '../OnboardingForm/OnboardingFormFields';
import { LocationFormValidation, LocationFormValues } from './LocationFormField';
import CottageAlert, { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import PhoneInput from 'react-phone-number-input/input';
import CottageTooltip from 'components/Common/CottageTooltip';
import { LocationErrors } from 'models/error';

interface LocationFormProps {
  onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onCancel }) => {
  const { subdomain } = useParams<Params>();
  const { businessId, producerId } = useContext(AppContext);
  const history = useHistory();
  const createLocation = useCreateLocation();
  const [phoneValue, setPhoneValue] = useState<string | undefined>();

  return (
    <>
      <Formik
        initialValues={LocationFormValues}
        validationSchema={LocationFormValidation}
        onSubmit={async (values, helpers) => {
          helpers.setStatus({ errorResponseMessage: '' });
          const {
            pathSegment,
            title,
            description,
            supportEmail,
            supportPhoneNumber,
            taxRate,
            collectSalesTax,
            urlStatusSwitch,
          } = values;
          const modifiedPhoneString = phoneValue;

          const input: CreateLocationInput = {
            producerId,
            businessId,
            pathSegment,
            title,
            status: LocationStatus.ACTIVE,
          };

          if (supportEmail) {
            input.supportEmail = supportEmail;
          }
          if (supportPhoneNumber) {
            input.supportPhoneNumber = modifiedPhoneString;
          }

          if (collectSalesTax) {
            input.taxRate = +((taxRate || 0) / 100);
          }

          if (description) {
            input.description = description;
          }

          if (urlStatusSwitch) {
            // switch engaged means set location to inactive, otherwise default to active
            input.status = urlStatusSwitch ? LocationStatus.INACTIVE : LocationStatus.ACTIVE;
          }

          try {
            const res = await createLocation.mutateAsync(input);
            const pathSegment = res.data?.createLocation?.location?.pathSegment;
            if (pathSegment) {
              // send to the overview of the newly created location
              history.push(`/business/${subdomain}/location/${pathSegment}/overview`);
            } else {
              // we shouldnt hit this but just in case redirect back to business overview
              history.push(`/business/${subdomain}/overview`);
            }
          } catch (e) {
            const exception = e?.errors[0];
            const code = exception.extensions?.code;
            let message;
            switch (code) {
              case LocationErrors.LocationLimitExceededErrorCode:
                message =
                  'Operating location limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
                break;
              case LocationErrors.DuplicatePathSegmentErrorCode:
                message = `The path segment ${pathSegment} with this name already exists.`;
                break;
              default:
                message = 'Something went wrong';
                break;
            }
            helpers.setStatus({ errorResponseMessage: message });
            helpers.setSubmitting(false);
          }
        }}>
        {(formikProps) => (
          <>
            <Heading className="text-2xl sm:text-3xl font-semibold mb-2">
              New Operating Location
            </Heading>
            <Button
              variant="link"
              colorScheme="cottage-green"
              color="lightGreen-100"
              fontSize="12px"
              fontWeight="medium"
              onClick={() => {
                formikProps.resetForm();
                onCancel();
              }}>
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Go Back
            </Button>
            <Box className="mx-auto" maxW="1017px">
              <Form>
                <Stack className="flex flex-row bg-white mt-4 p-6 rounded-lg">
                  <Box style={{ width: '25%' }} className="pr-6">
                    <Text fontSize="18px" fontWeight="500">
                      Location Details
                    </Text>
                    <Text className="my-2 mb-6 text-sm">
                      This is usually a city boundary in which you operate. You can create multiple
                      delivery rules and pick up addresses for this operating location once it's
                      created.
                    </Text>
                  </Box>
                  <Box style={{ width: '75%' }} className="pl-6 m-0">
                    <Box className="space-y-4 bg-white" style={{ minWidth: '100%' }}>
                      <Field name="title">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!(meta.touched && meta.error)}>
                            <FormLabel htmlFor="title" className="text-sm font-medium px-2">
                              Location Name
                            </FormLabel>
                            <Input
                              {...field}
                              id="title"
                              width="50%"
                              placeholder="Seattle"
                              onChange={(event) =>
                                handleUrlChange(
                                  'title',
                                  event,
                                  formikProps.setFieldValue,
                                  'pathSegment'
                                )
                              }
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="description">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!(meta.touched && meta.error)}>
                            <FormLabel htmlFor="description" className="text-sm font-medium px-2">
                              Location Description <span className="text-gray-300">(optional)</span>
                            </FormLabel>
                            <Textarea
                              {...field}
                              id="description"
                              resize="none"
                              placeholder="Providing meal deliveries every Wednesday and Friday between 6pm-8pm with a 24 hour cutoff. Order today!"
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Flex>
                        <Field name="collectSalesTax">
                          {({ field, form }: FieldProps) => (
                            <Checkbox
                              name="collectSalesTax"
                              className="mr-9 focus:shadow-none"
                              colorScheme="cottage-green"
                              onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                              <span className="ml-2 text-sm font-semibold">
                                Collect Sales Tax (%)
                              </span>
                            </Checkbox>
                          )}
                        </Field>
                        {formikProps.values.collectSalesTax && (
                          <Field name="taxRate">
                            {({ field, meta, form }: FieldProps) => (
                              <div className="flex items-center">
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
                              </div>
                            )}
                          </Field>
                        )}
                      </Flex>
                      <Box>
                        <Text className="text-xs text-grey">
                          <span className="font-bold">Please note: </span>
                          Please note that taxes applied will be subject to the Cottage commission
                          fee, as this fee is computed for the entire transaction. Cottage assumes
                          no responsibility for determining if you are not collecting sufficient tax
                          for your are. If in doubt, consult a tax professional.
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
                <Stack className="flex flex-row bg-white mt-4 p-6 rounded-lg">
                  <Box style={{ width: '25%' }} className="pr-6">
                    <Text fontSize="18px" fontWeight="500">
                      Location URL
                    </Text>
                    <Text className="my-2 mb-6 text-sm">
                      Customers will use this link to place orders with this location.
                    </Text>
                  </Box>
                  <Box style={{ width: '75%' }} className="pl-6 m-0">
                    <Flex gridGap="16px">
                      <LinkIcon className="h-6 w-6 inline" />
                      <Text className="text-sm text-mediumGreen">
                        {`https://${subdomain}.mycottage.menu/${formikProps.values.pathSegment}`}
                      </Text>
                    </Flex>
                    <Box className="mt-9">
                      <Field name="urlStatusSwitch">
                        {({ field, form }: FieldProps) => (
                          <FormControl display="flex" alignItems="center">
                            <FormLabel
                              htmlFor="urlStatusSwitch"
                              mb="0"
                              className="flex items-center gap-1 text-sm font-medium">
                              Location URL Status
                              <CottageTooltip text="You can pause this URL if you want to temporarily prevent taking orders from this location." />
                            </FormLabel>
                            <Switch
                              {...field}
                              colorScheme="cottage-blue"
                              ringOffsetColor="cottage-green"
                              id="urlStatusSwitch"
                              size="sm"
                              className="inline-block mr-2.5"
                              onChange={(e) => form.setFieldValue(field.name, e.target.checked)}
                            />
                            <Text
                              fontSize="14px"
                              fontWeight="500"
                              color="#5363F3"
                              className={
                                field.value
                                  ? 'text-cottage-blue-500 ml-2 font-semibold p-0'
                                  : 'text-cottage-green-500 ml-2 font-semibold p-0'
                              }>
                              {formikProps.values.urlStatusSwitch ? 'Paused' : 'Active'}
                            </Text>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box className={formikProps.values.urlStatusSwitch ? 'mt-9' : 'hidden'}>
                      <CottageAlert severity={AlertSeverity.SOFTINFO}>
                        People can still visit this location URL but cannot order any meals and will
                        see a courtesy message. Unpause this location to start accepting orders
                        again.
                      </CottageAlert>
                    </Box>
                  </Box>
                </Stack>
                <Stack className="flex flex-row bg-white mt-4 p-6 rounded-lg">
                  <Box style={{ width: '25%' }} className="pr-6">
                    <Text fontSize="18px" fontWeight="500">
                      Support Options
                    </Text>
                    <Text className="my-2 mb-6 text-sm">
                      These will be visible to all of your customers ordering from this location.
                      This is not required but it is recommended.
                    </Text>
                  </Box>
                  <Box style={{ width: '75%' }} className="pl-6 m-0">
                    <Box className="space-y-4 bg-white" style={{ minWidth: '100%' }}>
                      <Field name="supportPhoneNumber">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!(meta.error && meta.touched)}>
                            <FormLabel
                              htmlFor="supportPhoneNumber"
                              className="text-sm font-medium px-2">
                              Support Phone <span className="text-gray-300">(optional)</span>
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
                                formikProps.setFieldValue('supportPhoneNumber', e);
                              }}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="supportEmail">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!(meta.error && meta.touched)}>
                            <FormLabel htmlFor="supportEmail" className="text-sm font-medium px-2">
                              Support Email <span className="text-gray-300">(optional)</span>
                            </FormLabel>
                            <Input {...field} id="supportEmail" type="email" />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                  </Box>
                </Stack>

                {formikProps.status?.errorResponseMessage && (
                  <Box mt={4}>
                    <CottageAlert severity={AlertSeverity.ERROR}>
                      {formikProps.status.errorResponseMessage}
                    </CottageAlert>
                  </Box>
                )}

                <Stack className="flex flex-row mt-2 p-0">
                  <Box style={{ width: '25%' }} className="pr-6"></Box>
                  <Box style={{ width: '75%' }} className="pl-9 m-0">
                    <Box>
                      <Button
                        type="submit"
                        colorScheme="cottage-green"
                        size="lg"
                        className="text base font-semibold focus:outline-none focus:shadow-none"
                        isLoading={formikProps.isSubmitting}
                        disabled={!(formikProps.isValid && formikProps.dirty)}
                        isFullWidth>
                        Save Location
                      </Button>
                    </Box>
                    <Box className="mt-2">
                      <Button
                        type="button"
                        size="md"
                        className="text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
                        isFullWidth
                        onClick={() => {
                          formikProps.resetForm();
                          onCancel();
                        }}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </Form>
            </Box>
          </>
        )}
      </Formik>
    </>
  );
};

export default LocationForm;
