import * as Yup from 'yup';

export const LocationDetailsFormValues = {
  shopName: '',
  shopDescription: '',
  collectSalesTax: false,
  amount: 0,
};

export const LocationDetailsFormValidation = Yup.object().shape({
  shopName: Yup.string()
    .required('A shop name is required.')
    .min(2, 'Shop Name is too short.')
    .max(20, 'Shop Name is too long.'),
  shopDescription: Yup.string()
    .min(0, 'Shop description is too short.')
    .max(250, 'Shop description is too long.'),
  amount: Yup.number().positive('Must be a positive number.').max(100, 'Percent is invalid'),
});
