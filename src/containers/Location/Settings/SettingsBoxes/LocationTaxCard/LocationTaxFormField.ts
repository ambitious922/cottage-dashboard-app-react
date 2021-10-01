import * as Yup from 'yup';

export const LocationDetailsTaxFormValues = {
    taxPercentage: undefined,
}

export const LocationDetailsFormTaxValidation = Yup.object().shape({
    taxPercentage: Yup
        .number()
        .min(0, 'Percent is invalid')
        .max(100, 'Percent is invalid')
});
