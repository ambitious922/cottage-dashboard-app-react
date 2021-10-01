import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
// @ts-ignore
import { Script } from 'react-load-script';
import { usePlacesWidget } from 'react-google-autocomplete';
import {
  CreatePickupAddressInput,
  UpdatePickupAddressInput,
  StateOrProvince,
  CountryCode,
} from 'API';
import { useCreatePickupAddress, useUpdatePickupAddress } from 'api/query-hooks/pickupaddresses';
import { AppContext } from 'App';
import { getLatLongFromZip, initializeGooglePlacesAutoComplete } from 'utils/google';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import { useContext, useRef, useState } from 'react';
import {
  CreatePickupFormFields,
  CreatePickupFormValidation,
  CreatePickupFormValues,
  PickupFormValues,
} from './PickupFormFields';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { PickupLocationErrors } from 'models/error';

interface IPickupFormProps {
  onClose: () => void;
  pickupFormValues?: PickupFormValues;
  addressId?: string;
}

interface AddressValues {
  street?: string;
  city?: string;
  postalCode?: string;
  stateOrProvince?: StateOrProvince;
  country?: CountryCode;
  street2?: string | null | undefined;
  title?: string | null | undefined;
  lat?: number;
  long?: number;
}

const PickupForm: React.FC<IPickupFormProps> = ({ pickupFormValues, onClose, addressId }) => {
  const { businessId, locationId } = useContext(AppContext);
  const cancelRef = useRef();

  const [parsedAddress, setParsedAddress] = useState<AddressValues>();

  const isEdit = !!pickupFormValues;

  const createPickupAddress = useCreatePickupAddress();
  const updatePickupAddress = useUpdatePickupAddress();

  const createPickupAddressHelper = async (values: PickupFormValues) => {
    const { street2, title } = values;
    if (!parsedAddress) {
      return;
    }

    const { street, city, postalCode, stateOrProvince, country, lat, long } = parsedAddress;

    if (!street || !city || !postalCode || !stateOrProvince || !country || !lat || !long) {
      return;
    }

    const input: CreatePickupAddressInput = {
      locationId,
      businessId,
      street,
      street2: street2 || undefined,
      city,
      postalCode,
      stateOrProvince,
      country,
      title: title || undefined,
      lat,
      long,
    };

    await createPickupAddress.mutateAsync(input);
    onClose();
  };

  const updatePickupAddressHelper = async (values: PickupFormValues) => {
    if (!addressId) {
      return;
    }
    const castedValues = await CreatePickupFormValidation.validate(values);
    const { title } = castedValues;

    const input: UpdatePickupAddressInput = {
      addressId,
      locationId,
      businessId,
      title: title || undefined,
    };

    await updatePickupAddress.mutateAsync(input);
    onClose();
  };

  const onSubmit = async (
    valuesFromFormik: PickupFormValues,
    helpers: FormikHelpers<PickupFormValues>
  ) => {
    helpers.setStatus({ errorResponseMessage: '' });

    // merge the the form values (street2 and title) with the locally stored values parsed from google
    const values: AddressValues = {
      ...valuesFromFormik,
      ...parsedAddress,
    };

    try {
      if (isEdit) {
        await updatePickupAddressHelper(values);
      } else {
        await createPickupAddressHelper(values);
      }
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case PickupLocationErrors.PickupLocationExceededErrorCode:
          message =
            'Pickup location limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        case PickupLocationErrors.PickupAddressNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      helpers.setStatus({ errorResponseMessage: message });
      helpers.setSubmitting(false);
    }
  };

  const parseAutocompletedAddress = (autocompletedAddress: any) => {
    // Extract City From Address Object
    const address = autocompletedAddress.address_components;

    // Check if address is valid
    if (address) {
      const postalCode = address.find((a: any) => a.types.includes('postal_code'));
      const country = address.find((a: any) => a.types.includes('country'));
      const state = address.find((a: any) => a.types.includes('administrative_area_level_1'));
      const city = address.find((a: any) => a.types.includes('locality'));

      const streetNumber = address.find((a: any) => a.types.includes('street_number'));
      const route = address.find((a: any) => a.types.includes('route'));

      let street = null;
      if (streetNumber && route) {
        street = `${streetNumber.short_name} ${route.long_name}`;
      } else if (route) {
        street = route.long_name;
      }

      return {
        street,
        city: city ? city.short_name : null,
        postalCode: postalCode ? postalCode.long_name : null,
        stateOrProvince: state ? state.short_name : null,
        country: country ? country.short_name : null,
      };
    }
    return null;
  };

  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY || '',
    options: {
      types: ['address'],
    },
    onPlaceSelected: async (place) => {
      console.log(place);
      // cast to local address
      const parsedAddress = parseAutocompletedAddress(place);

      const res = await getLatLongFromZip(parsedAddress?.postalCode);

      setParsedAddress({
        street: parsedAddress?.street,
        city: parsedAddress?.city,
        stateOrProvince: parsedAddress?.stateOrProvince,
        postalCode: parsedAddress?.postalCode,
        country: parsedAddress?.country,
        lat: res.lat,
        long: res.lng,
      });
    },
  });

  return (
    <>
      <Text className="px-2 mb-1 text-sm font-medium">Pickup Address</Text>
      <Input
        id="location-autocomplete"
        placeHolder=""
        // @ts-ignore
        ref={ref}
        onChange={(e) => {
          if (e.target.value.length === 0) {
            setParsedAddress(undefined);
          }
        }}
        disabled={isEdit}
      />
      <style>{`.pac-container {z-index: 10000 !important;}`}</style>
      <Formik
        initialValues={pickupFormValues ? pickupFormValues : CreatePickupFormValues}
        onSubmit={(values, helpers) => onSubmit(values, helpers)}
        isInitialValid={isEdit}
        validationSchema={CreatePickupFormValidation}
        validateOnBlur={false}>
        {(formikProps) => {
          return (
            <Form className="bg-white" style={{ minWidth: '100%' }}>
              <Field name="street2">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    isInvalid={!!(form.errors.street2 && form.touched.street2)}
                    className="mt-6">
                    <FormLabel htmlFor="street2" className="px-2 mb-1 text-sm font-medium">
                      {CreatePickupFormFields.street2}{' '}
                      <span className="ml-1 text-xs font-normal text-grey">(optional)</span>
                    </FormLabel>
                    <Input
                      {...field}
                      id="street2"
                      size="md"
                      width="full"
                      className="border-lightGreen-100"
                      disabled={isEdit}
                    />
                    <FormErrorMessage>{form.errors.street}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="title">
                {({ field, form }: FieldProps) => (
                  <FormControl
                    isInvalid={!!(form.errors.title && form.touched.title)}
                    className="mt-6 mb-4">
                    <FormLabel htmlFor="description" className="px-2 mb-1 text-sm font-medium">
                      {CreatePickupFormFields.title}{' '}
                      <span className="ml-1 text-xs font-normal text-grey">(optional)</span>
                    </FormLabel>
                    {
                      <Input
                        {...field}
                        id="title"
                        size="md"
                        width="full"
                        className="border-lightGreen-100"
                      />
                    }
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Box className="mt-5">
                <Button
                  colorScheme="cottage-green"
                  height="56px"
                  className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                  type="submit"
                  isDisabled={!parsedAddress}
                  isLoading={createPickupAddress.isLoading}>
                  Create
                </Button>
                <Button
                  height="36px"
                  className="w-full mt-2 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
                  ref={cancelRef.current}
                  onClick={onClose}>
                  Close
                </Button>
                {formikProps.status?.errorResponseMessage && (
                  <Box mt={4}>
                    <CottageAlert severity={AlertSeverity.ERROR}>
                      {formikProps.status.errorResponseMessage}
                    </CottageAlert>
                  </Box>
                )}
              </Box>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default PickupForm;
