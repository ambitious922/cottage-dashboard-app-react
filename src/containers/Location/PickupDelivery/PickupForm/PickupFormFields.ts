import * as Yup from 'yup';

export enum CreatePickupFormFields {
    street2 = 'Suite/Apt',
    title = 'Pickup Title'
}

export interface PickupFormValues {
    street2?: string | null;
    title?: string | null;
}

export const CreatePickupFormValues: PickupFormValues = {
    street2: '',
    title: '',
}

export const CreatePickupFormValidation = Yup.object().shape({
    street2: Yup.string()
    .notRequired()
    .nullable()
    .min(0)
    .max(20, 'Suite/Apt cannot be greater than 20 characters'),
    title: Yup.string()
    .notRequired()
    .nullable()
    .min(3, 'Title should be at least 3 characters')
    .max(60, 'Title should be at most 60 characters'),
});

