import React, { useContext } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useHistory } from 'react-router-dom';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Text,
  Select,
  Checkbox,
  Button,
  Box,
  Heading,
  Flex,
  Image,
  Link as ChakraLink,
} from '@chakra-ui/react';

import {
  OnboardingFormValues,
  OnboardingFormValidation,
  handleUrlChange,
  StateTypeValues,
  CountryTypeValues,
  BusinessTypeDisplayValues,
} from './OnboardingFormFields';
import PlanSelectionFragment from './PlanSelectionFragment';
import Card from 'components/Common/Card';
import { BusinessType, CreateBusinessInput } from 'API';
import { useCreateBusiness } from 'api/query-hooks/business';
import { enumKeys, removeNullProp } from 'utils';
import { AppContext } from 'App';
import CottageMapDropdown from 'components/Common/CottageMapDropdown';
import CottageTooltip from 'components/Common/CottageTooltip';
import { useGetProducer } from 'api/query-hooks/producer';
import { Spinner } from 'components/Common/Spinner';
import DashboardNotFound from 'containers/DashboardNotFound';
import CottageAlert, { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { signOut } from 'api/auth';
import { PageRoutes } from 'constants/Routes';
import { FooterLogoIcon } from 'components/Common/CottageSvgIcons/CottageSvgIcons';

interface IOnboardingFormProps {}

// show some love to customer 1
const PLACE_HOLDER_BUSINESS_NAME = 'Ideal Eatery';
const PLACE_HOLDER_SUBDOMAIN = 'idealeatery';
const PLACE_HOLDER_LOCATION_NAME = 'Miami';
const PLACE_HOLDER_PATH_SEGMENT = 'miami';

const SUBMIT_BUTTON_TEXT = 'Finish and Save';

const OnboardingForm: React.FC<IOnboardingFormProps> = ({}) => {
  const appContext = useContext(AppContext);
  const { producerId, businessId, businessSubdomain } = appContext;
  const history = useHistory();

  if (businessId && businessSubdomain) {
    history.replace(`/business/${businessSubdomain}`);
  }

  const createBusinessMutation = useCreateBusiness();
  const getProducerQuery = useGetProducer({ id: producerId });

  if (getProducerQuery.isLoading) {
    return <Spinner />;
  }

  if (getProducerQuery.isError) {
    return <DashboardNotFound />;
  }

  const onSignoutClick = async () => {
    await signOut();
    history.push(PageRoutes.SIGN_IN);
  };

  return (
    <Box className="bg-off-white">
      <Box className="flex items-center justify-between" px="51px" pt="37px" pb="0">
        <Image
          className="w-auto"
          height="42px"
          src="https://cdn.cottage.menu/assets/dashboard/dashboard_cottage_logo.svg"
          alt="Logo goes here"
        />
        <Button
          variant="link"
          colorScheme="cottage-green"
          color="lightGreen-100"
          fontSize="12px"
          fontWeight="medium"
          className="mt-1 text-sm text-lightGreen-100"
          onClick={() => onSignoutClick()}>
          Sign out
        </Button>
      </Box>
      <Box className="max-w-7xl mx-auto px-4 py-7 pb-28 sm:px-6 lg:px-8 font-sans">
        <Box className="mx-auto" maxW="1017px">
          <Formik
            initialValues={OnboardingFormValues}
            validationSchema={OnboardingFormValidation}
            onSubmit={async (values, helpers) => {
              helpers.setStatus({ errorResponseMessage: '' });
              const modifiedPhoneString = '+1' + values.phoneNumber;
              const { address, location } = values;
              const input: CreateBusinessInput = {
                producerId,
                title: values.title,
                type: values.type,
                level: values.level,
                subdomain: values.subdomain,
                email: values.email,
                phoneNumber: modifiedPhoneString,
                address: {
                  street: address.street,
                  city: address.city,
                  postalCode: address.postalCode,
                  country: address.country,
                  stateOrProvince: address.stateOrProvince,
                  lat: 0,
                  long: 0,
                },
              };
              if (address.street2) {
                input.address.street2 = address.street2;
              }
              if (values.createOperatingLocation) {
                input.location = {
                  producerId,
                  pathSegment: location.pathSegment,
                  title: location.title,
                  supportEmail: values.email,
                  supportPhoneNumber: modifiedPhoneString,
                };
              }
              removeNullProp(input);
              try {
                const res = await createBusinessMutation.mutateAsync(input);
                const business = res.data?.createBusiness?.business;
                appContext.setBusinessId(business?.id || '');
                // TODO we should push to settings but that yields not found because top level router is unaware of dashboard subpages
                history.push(`/business/${business?.subdomain}`);
              } catch (e) {
                const exception = e?.errors[0];
                const code = exception.extensions?.code;
                let message;
                switch (code) {
                  default:
                    message = 'Something went wrong';
                    break;
                }
                helpers.setStatus({ errorResponseMessage: message });
                helpers.setSubmitting(false);
              }
            }}>
            {(formikProps) => (
              <Form>
                <div className="font-sans text-darkGreen">
                  <Heading fontSize="21px" className="font-sans text-center font-semibold">
                    Lets set up your account
                  </Heading>
                  <Box marginTop="35px" className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6">Business Details</h3>
                        <p className="mt-1 text-sm text-lightGreen-100">
                          We need a few details about your business so we can customize your Cottage
                          acount.
                        </p>
                        <p className="mt-2 text-sm text-lightGreen-100">
                          This information is not shared with your customers. We'll contact you at
                          the email you provide.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <Card className="shadow-none">
                        <Field name="title">
                          {({ field, meta }: FieldProps) => (
                            <FormControl isInvalid={!!(meta.touched && meta.error)}>
                              <FormLabel htmlFor="title" className="text-sm font-medium px-2">
                                Business Name
                              </FormLabel>
                              <Input
                                {...field}
                                id="title"
                                placeholder={PLACE_HOLDER_BUSINESS_NAME}
                                onChange={(event) =>
                                  handleUrlChange(
                                    'title',
                                    event,
                                    formikProps.setFieldValue,
                                    'subdomain'
                                  )
                                }
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <div className="mt-8">
                          <div className="flex items-center gap-1">
                            <Text className="text-sm font-medium px-2">
                              Cottage Business URL&nbsp;
                            </Text>
                            <CottageTooltip text="Your free cottage domain. We can mask this with your personal website later just reach out to us." />
                          </div>
                          <div className="text-lg mt-6 px-2">
                            https://
                            <span className="text-lightGreen-100">
                              {!!formikProps.values.subdomain
                                ? formikProps.values.subdomain
                                : PLACE_HOLDER_SUBDOMAIN}
                            </span>
                            .mycottage.menu
                          </div>
                        </div>
                        <div className="mt-10">
                          <Field name="type">
                            {({ field, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel htmlFor="type" className="text-sm font-medium px-2">
                                  Business Type
                                </FormLabel>
                                <CottageMapDropdown
                                  value={{
                                    display: BusinessTypeDisplayValues[field.value as BusinessType],
                                    item: field.value as BusinessType,
                                  }}
                                  onChange={(type) => {
                                    formikProps.setFieldValue(field.name, BusinessType[type.item]);
                                  }}
                                  items={enumKeys(BusinessType).map((type) => {
                                    return {
                                      display: BusinessTypeDisplayValues[type],
                                      item: type,
                                    };
                                  })}
                                />
                                <FormErrorMessage>{meta.error}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </div>
                        <div className="mt-4 md:grid md:grid-cols-2 md:gap-x-4">
                          <div className="mt-4 md:mt-0">
                            <Field name="phoneNumber">
                              {({ field, meta }: FieldProps) => (
                                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                                  <FormLabel
                                    htmlFor="phoneNumber"
                                    className="text-sm font-medium px-2">
                                    Phone Number
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    id="phoneNumber"
                                    type="tel"
                                    // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                  />
                                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <Field name="email">
                              {({ field, meta }: FieldProps) => (
                                <FormControl isInvalid={!!(meta.error && meta.touched)}>
                                  <Flex alignItems="center" justifyContent="space-between">
                                    <FormLabel htmlFor="email" className="text-sm font-medium px-2">
                                      Email
                                    </FormLabel>
                                    <Field name="reuseProducerEmail">
                                      {({ field, form }: FieldProps) => (
                                        <Checkbox
                                          name="reuseProducerEmail"
                                          className="-mt-2 focus:shadow-none"
                                          colorScheme="cottage-green"
                                          onChange={(e) => {
                                            form.setFieldValue(field.name, e.target.checked);
                                            e.target.checked
                                              ? formikProps.setFieldValue(
                                                  'email',
                                                  getProducerQuery.data?.data?.producer?.email
                                                )
                                              : formikProps.setFieldValue('email', '');
                                          }}>
                                          <span className="text-sm font-medium">
                                            Reuse my email
                                          </span>
                                        </Checkbox>
                                      )}
                                    </Field>
                                  </Flex>
                                  <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    value={
                                      formikProps.values.reuseProducerEmail
                                        ? getProducerQuery.data?.data?.producer?.email
                                        : field.value
                                    }
                                    disabled={formikProps.values.reuseProducerEmail}
                                  />
                                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Box>
                </div>
                <div className="mt-4 sm:mt-4">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6">Primary Business Address</h3>
                        <p className="mt-1 text-sm text-lightGreen-100">
                          This is the primary business address that Cottage uses for processing
                          payments and tax information.
                        </p>
                        <p className="mt-2 text-sm text-lightGreen-100">
                          This is different from an operating location address and won't be
                          displayed to your customers.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <Card className="shadow-none">
                        <Field name="address.street">
                          {({ field, meta }: FieldProps) => (
                            <FormControl isInvalid={!!(meta.touched && meta.error)}>
                              <FormLabel
                                htmlFor="address.street"
                                className="text-sm font-medium px-2">
                                Street
                              </FormLabel>
                              <Input {...field} id="street" />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <div className="mt-4">
                          <Field name="address.street2">
                            {({ field, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel
                                  htmlFor="address.street2"
                                  className="text-sm font-medium px-2">
                                  Suite, Apartment, etc.&nbsp;
                                  <span className="text-gray-500">(optional)</span>
                                </FormLabel>
                                <Input {...field} id="street2" />
                                <FormErrorMessage>{meta.error}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </div>

                        <div className="mt-4 md:grid md:grid-cols-2 md:gap-x-4">
                          <div className="mt-4 md:mt-0">
                            <Field name="address.city">
                              {({ field, meta }: FieldProps) => (
                                <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                  <FormLabel
                                    htmlFor="address.city"
                                    className="text-sm font-medium px-2">
                                    City
                                  </FormLabel>
                                  <Input {...field} id="city" />
                                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <Field name="address.postalCode">
                              {({ field, meta }: FieldProps) => (
                                <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                  <FormLabel
                                    htmlFor="address.postalCode"
                                    className="text-sm font-medium px-2">
                                    Zip Code
                                  </FormLabel>
                                  <Input {...field} id="address.postalCode" />
                                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </div>
                        </div>
                        <div className="mt-4 md:grid md:grid-cols-2 md:gap-x-4">
                          <div className="mt-4 md:mt-0">
                            <Field name="address.stateOrProvince">
                              {({ field, meta }: FieldProps) => (
                                <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                  <FormLabel
                                    htmlFor="address.stateOrProvince"
                                    className="text-sm font-medium px-2">
                                    State
                                  </FormLabel>
                                  <Select {...field} id="address.stateOrProvince">
                                    {StateTypeValues.map((stateOrProvince) => (
                                      <option
                                        value={stateOrProvince.value}
                                        key={stateOrProvince.value}>
                                        {stateOrProvince.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <Field name="address.country">
                              {({ field, meta }: FieldProps) => (
                                <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                  <FormLabel
                                    htmlFor="address.country"
                                    className="text-sm font-medium px-2">
                                    Country
                                  </FormLabel>
                                  <Select {...field} id="country">
                                    {CountryTypeValues.map((country) => (
                                      <option value={country.value} key={country.name}>
                                        {country.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-8">
                          <Field name="createOperatingLocation">
                            {({ field, form }: FieldProps) => (
                              <Checkbox
                                name="createOperatingLocation"
                                onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                                <span className="text-sm font-medium">
                                  This is also an operating location{' '}
                                </span>
                              </Checkbox>
                            )}
                          </Field>
                          &nbsp;
                          <CottageTooltip text="Each business needs at least one operating location. Your customers will sign up with your business, but they will order directly from your operating location." />
                        </div>
                        <div
                          className={`${
                            formikProps.values.createOperatingLocation ? 'mt-4' : 'hidden'
                          }`}>
                          <Text className="text-sm font-medium px-2">
                            An operating location represents the general area you plan to do
                            business. It is usually a city. Premium Cottage members can create
                            multiple operating locations.
                          </Text>
                          <Field name="location.title">
                            {({ field, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel
                                  htmlFor="title"
                                  className="mt-4 text-sm font-medium px-2">
                                  Location Name
                                </FormLabel>
                                <Input
                                  {...field}
                                  id="location.title"
                                  placeholder={PLACE_HOLDER_LOCATION_NAME}
                                  onChange={(event) =>
                                    handleUrlChange(
                                      'location.title',
                                      event,
                                      formikProps.setFieldValue,
                                      'location.pathSegment'
                                    )
                                  }
                                />
                                <FormErrorMessage>{meta.error}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <div className="mt-8">
                            <div className="flex items-center gap-1">
                              <Text className="text-sm font-medium px-2">
                                Unique Location URL &nbsp;
                              </Text>
                              <CottageTooltip
                                text={
                                  'Your customers will order from your location. As your business grows to other cities or regions, you can create new operating locations which takes less than 30 seconds. Cottage resources can be shared across your locations.'
                                }
                              />
                            </div>
                            <div className="text-lg mt-6 px-2">
                              https://
                              <span className="text-lightGreen-100">
                                {!!formikProps.values.subdomain
                                  ? formikProps.values.subdomain
                                  : PLACE_HOLDER_SUBDOMAIN}
                              </span>
                              .mycottage.menu/
                              <span className="text-lightGreen-100">
                                {!!formikProps.values.location.pathSegment
                                  ? formikProps.values.location.pathSegment
                                  : PLACE_HOLDER_PATH_SEGMENT}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-4">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6">Choose Your Plan</h3>
                        <p className="mt-1 text-sm text-lightGreen-100">
                          If you're just starting out with Cottage Standard, you can easily upgrade
                          to Cottage Premium at any point.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <Card className="shadow-none">
                        <PlanSelectionFragment name="level" />
                        <div className="mt-10 text-sm text-center px-10">
                          {`By selecting ${SUBMIT_BUTTON_TEXT} below, I understand and agree to
                          Cottage's User `}
                          <ChakraLink href="#" className="text-lightGreen-100">
                            Terms of Service
                          </ChakraLink>{' '}
                          and{' '}
                          <ChakraLink href="#" className="text-lightGreen-100">
                            Privacy Policy
                          </ChakraLink>
                          .
                        </div>
                        <div className="mt-12">
                          <Button
                            type="submit"
                            colorScheme="cottage-green"
                            size="lg"
                            className="text-base font-semibold focus:outline-none focus:shadow-none"
                            disabled={!(formikProps.isValid && formikProps.dirty)}
                            isLoading={formikProps.isSubmitting}
                            isFullWidth>
                            {SUBMIT_BUTTON_TEXT}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                {formikProps.status?.errorResponseMessage && (
                  <Box mt={4}>
                    <CottageAlert severity={AlertSeverity.ERROR}>
                      {formikProps.status.errorResponseMessage}
                    </CottageAlert>
                  </Box>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
      <Box className="flex items-center justify-between bg-white" px="51px" py="20px">
        <Flex alignItems="center">
          <FooterLogoIcon />
          <Text color="#294D3B" className="font-sans text-xs font-normal font-sans ml-4 opacity-20">Copyright &copy; 2020 Cottage Tech LLC - All rights reserved</Text>
        </Flex>
        <Flex alignItems="center">
          <Button
            variant="link"
            colorScheme="cottage-green"
            className="mr-4 font-sans text-sm font-normal text-lightGreen-100"
            onClick={() => {}}>
            {'Privacy Policy'}
          </Button>
          <span className="font-sans text-xs text-grey">|</span>
          <Button
            variant="link"
            colorScheme="cottage-green"
            className="ml-4 font-sans text-sm font-normal text-lightGreen-100"
            onClick={() => {}}>
            {'Terms & Conditions'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default OnboardingForm;
