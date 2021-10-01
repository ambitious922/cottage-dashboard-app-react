import * as Yup from 'yup';
import { MAX_DOLLARS } from 'constants/index';

export enum CreateDeliveryFormFields {
    minimumTotal = 'Minimum Total',
    fee = 'Fee',
    postalCodes = 'Zip codes',
}

export interface DeliveryFormValues {
    minimumTotal?: number | null;
    fee?: number | null;
    postalCodes: string;
}

export const CreateDeliveryFormValues: DeliveryFormValues = {
    minimumTotal: undefined,
    fee: undefined,
    postalCodes: '',
}

export const CreateDeliveryFormValidation = Yup.object().shape({
    minimumTotal: Yup
        .number()
        .moreThan(0, 'Minimum total is too low')
        .max(MAX_DOLLARS, `Minimum total is too high`)
        .required('Minimum total is required'),
    fee: Yup
        .number()
        .min(0, 'Fee is too low')
        .max(MAX_DOLLARS, `Fee is too high`)
        .required('Fee is required'),
    postalCodes: Yup.string()
        .matches(/^([, ]*\d{5})+[, ]*$/, "Each zip code should be 5 characters")
        .required("Zip codes are required"),
});

