import * as Yup from 'yup';

export const LocationSupportOptionsFormValues = {
    supportPhoneNumber: null,
    supportEmail: ''
}

export const LocationSupportOptionsFormValidation = Yup.object().shape({
    supportPhoneNumber: Yup
        .string()
        .min(12, 'Support phone number is too short')
        .max(12, 'Support phone number is too long'),
    supportEmail: Yup
        .string()
        .email()
});

 