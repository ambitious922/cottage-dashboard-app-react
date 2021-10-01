import { LocationStatus } from 'API';
import * as Yup from 'yup';

// TODO unsure about how locationStatus should be implmented
interface ILocationFormValues {
  pathSegment: string;
  title: string;
  supportEmail: string;
  supportPhoneNumber: string;
  collectSalesTax: boolean;
  taxRate: number | null | undefined;
  urlStatusSwitch: boolean;
  description?: string;
}

export const LocationFormValues: ILocationFormValues = {
  pathSegment: '',
  title: '',
  supportEmail: '',
  supportPhoneNumber: '',
  collectSalesTax: false,
  taxRate: 1.0,
  urlStatusSwitch: false,
  description: '',
};

export const LocationFormValidation = Yup.object().shape({
  title: Yup
    .string()
    .min(2, "Title is too short")
    .max(20, "Title is too long")
    .required('Location name is required'),
  supportEmail: Yup
    .string()
    .notRequired()
    .email('Must be an email'),
  supportPhoneNumber: Yup
    .string()
    .min(12, "Support phone number is too short")
    .max(12, "Support phone number is too long")
    .notRequired(),
  taxRate: Yup
    .number()
    .notRequired()
    .min(1, "Tax rate is must be between 1%-100%")
    .max(100, "Tax rate is must be between 1%-100%"),
  description: Yup
    .string()
    .notRequired()
    .min(1, "Description is too short")
    .max(250, "Description is too long"),
});
