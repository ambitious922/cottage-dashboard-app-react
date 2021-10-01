import React from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  Switch,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { LinkIcon } from '@heroicons/react/outline';
import { LocationStatus } from 'API';
import { LocationUrlFormValidation, LocationUrlFormValues } from './LocationUrlFormFields';
import CottageTooltip from 'components/Common/CottageTooltip';

export interface LocationUrlFormProps {
  locationUrl: string;
  locationStatus: LocationStatus;
  onSubmit: (locationUrl: string, locationStatus: LocationStatus) => Promise<void>;
  disabled: boolean;
}

const LocationUrlForm: React.FC<LocationUrlFormProps> = ({
  onSubmit,
  locationUrl,
  locationStatus,
  disabled,
}) => {
  return (
    <Formik
      initialValues={{ locationUrl, locationStatus } || LocationUrlFormValues}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={({ locationUrl, locationStatus }) => onSubmit(locationUrl, locationStatus)}
      validationSchema={LocationUrlFormValidation}>
      {({ isValid, dirty }) => {
        return (
          <Form className="space-y-9 bg-white" style={{ minWidth: '100%' }}>
            <Field name="locationUrl">
              {({ field, form }: FieldProps) => (
                <FormControl isInvalid={false}>
                  <FormLabel className="flex items-center gap-4" htmlFor="locationUrl">
                    <LinkIcon className="h-6 w-6 inline" />
                    {disabled ? (
                      <Text className="text-sm text-darkGray">{field.value}</Text>
                    ) : (
                      <Input
                        {...field}
                        id="locationUrl"
                        size="md"
                        width="full"
                        className="border-lightGreen-100"
                      />
                    )}
                  </FormLabel>
                  <FormErrorMessage>{form.errors.locationUrl}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="locationStatus">
              {({ field, form }: FieldProps) => (
                <FormControl
                  isInvalid={!!(form.errors.locationStatus && form.touched.locationStatus)}>
                  <FormLabel htmlFor="locationStatus" className="flex items-center text-sm">
                    {/* TODO: tooltip on info circle  */}
                    Location URL Status&nbsp;
                    <CottageTooltip text="Each operating location has its own path segment on your cottage subdomain." />
                    <Switch
                      colorScheme="green"
                      id="locationStatus"
                      size="sm"
                      className="inline-block mr-2.5 ml-8"
                      defaultChecked={locationStatus === LocationStatus.ACTIVE ? true : false}
                      isDisabled={disabled}
                    />
                    <Text fontSize="14px" fontWeight="500" color="#4EA141">
                      {locationStatus === LocationStatus.ACTIVE ? 'Active' : ''}
                    </Text>
                  </FormLabel>
                  <FormErrorMessage>{form.errors.locationStatus}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              disabled={!(isValid && dirty)}
              colorScheme="cottage-green"
              className="w-full focus:outline-none focus:shadow-none"
              type="submit"
              style={{ display: disabled ? 'none' : 'block' }}>
              Save Changes
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LocationUrlForm;
