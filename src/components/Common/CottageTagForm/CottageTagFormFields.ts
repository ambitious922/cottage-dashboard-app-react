import * as Yup from 'yup';

export enum CottageTagFormModes {
  VIEW = 'view',
  NEW = 'new',
  SELECT = 'select',
}

export const getTagFormValues = () => {
  return { name: '' };
};

export const TagFormValidation = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, "Name can't be less than 2 characters")
    .max(50, "Name can't be more than 50 characters"),
});
