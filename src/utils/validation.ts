import { CountryCode, StateOrProvince } from 'API';
import * as Yup from 'yup';

export const AddressFormValidation = Yup.object().shape({
    street: Yup
        .string()
        .required('Street is required')
        .min(2, 'Street is too short')
        .max(100, 'Street is too long'),
    street2: Yup
        .string()
        .notRequired()
        .min(1, 'Street2 is too short')
        .max(100, 'Street2 is too long'),
    city: Yup
        .string()
        .required('City is required')
        .min(3, 'City is too short')
        .max(50, 'City is too long'),
    postalCode: Yup
        .string()
        .required('Zip code is required')
        .min(5, 'Zip code is too short')
        .max(5, 'Zip code is too long'),
    stateOrProvince: Yup
        .mixed<StateOrProvince>()
        .oneOf(Object.values(StateOrProvince))
        .required('State is required.'),
    country: Yup
        .mixed<CountryCode>()
        .oneOf(Object.values(CountryCode))
        .required('Country is required.'),
});