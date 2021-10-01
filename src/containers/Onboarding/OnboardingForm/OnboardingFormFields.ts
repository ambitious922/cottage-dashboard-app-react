import * as Yup from 'yup';
import { BusinessLevelType, BusinessType, CountryCode, StateOrProvince } from 'API';
import { enumKeys } from 'utils';
import { AddressFormValidation } from 'utils/validation';

const domainUrlEncoder = (value: string) =>
  encodeURIComponent(
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
  ).toLowerCase();

// Needed to update the domain and subdomain fields
export const handleUrlChange = (
  name: string,
  event: any,
  setFieldValue: (field: string, string: string) => void,
  changedField: string
) => {
  const { value } = event.target;
  setFieldValue(name, value);
  setFieldValue(changedField, domainUrlEncoder(value));
};

export const BusinessTypeValues = [
  { name: 'Company', value: BusinessType[BusinessType.COMPANY] },
  { name: 'Individual', value: BusinessType[BusinessType.INDIVIDUAL] },
];
export const StateTypeValues: {
  name: string;
  value: StateOrProvince;
}[] = enumKeys(StateOrProvince).map((state) => {
  return { name: state, value: StateOrProvince[state] };
});

export const CountryTypeValues: {
  name: string;
  value: CountryCode;
}[] = enumKeys(CountryCode).map((country) => {
  return { name: country, value: CountryCode[country] };
});

interface IOnboardingFormValues {
  createOperatingLocation: boolean;
  type: BusinessType;
  level: BusinessLevelType;
  subdomain: string;
  title: string;
  email: string;
  reuseProducerEmail: boolean;
  phoneNumber: string;
  address: {
    street: string;
    street2: string;
    city: string;
    postalCode: string;
    country: CountryCode;
    stateOrProvince: StateOrProvince;
  };
  location: {
    pathSegment: string;
    title: string;
  };
}

export const OnboardingFormValues: IOnboardingFormValues = {
  type: BusinessType.COMPANY,
  level: BusinessLevelType.STANDARD,
  subdomain: '',
  title: '',
  reuseProducerEmail: false,
  email: '',
  phoneNumber: '',
  address: {
    street: '',
    street2: '',
    city: '',
    postalCode: '',
    country: CountryCode.US,
    stateOrProvince: StateOrProvince.WA,
  },
  createOperatingLocation: false,
  location: {
    pathSegment: '',
    title: '',
  },
};

export const BusinessTypeDisplayValues: Record<BusinessType, string> = {
  [BusinessType.INDIVIDUAL]: "Individual - If you don't have an EIN number",
  [BusinessType.COMPANY]: 'Company - If you have an EIN number',
};

export const OnboardingFormValidation = Yup.object().shape({
  type: Yup.mixed()
    .oneOf([BusinessType.COMPANY, BusinessType.INDIVIDUAL])
    .required('Account Type is required'),
  level: Yup.mixed()
    .oneOf([BusinessLevelType.STANDARD, BusinessLevelType.PREMIUM])
    .required('Plan is required'),
  title: Yup.string()
    .min(3, 'Business name is too short')
    .max(30, 'Business name is too long')
    .required('Business name is required'),
  email: Yup.string().email().required('Email is required'),
  phoneNumber: Yup.string()
    .min(10, 'Phone number is too short')
    .max(12, 'Phone number is too long')
    .required('Phone number is required'),
  createOperatingLocation: Yup.boolean().notRequired(),
  address: AddressFormValidation,
  location: Yup.object().shape({
    title: Yup.string().when('createOperatingLocation', {
      is: true,
      then: Yup.string().required('Location name is required'),
    }),
  }),
});
