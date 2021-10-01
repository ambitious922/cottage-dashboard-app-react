import * as Yup from 'yup';
import { PlanInterval } from 'API';
import { MAX_DOLLARS } from 'constants/index';

export enum CreatePlanFormFields {
    title = 'Plan Name',
    interval = 'Renewal Interval',
    value = 'Value',
    price = 'Price',
    description = 'Description'
}

export type FrontendImage = {
    url: string,
    file: File
}

export interface PlanFormValues {
    title: string;
    interval: PlanInterval;
    value?: number | null;
    price?: number | null;
    description?: string | null;
    images?: Map<string, string>;
}

export const CreatePlanFormValues: PlanFormValues = {
    title: '',
    interval: PlanInterval.WEEKLY,
    value: undefined,
    price: undefined,
    description: '',
    images: new Map<string,string>(),
}

export const CreatePlanFormValidation = Yup.object().shape({
    title: Yup
        .string()
        .required('Title is required')
        .min(3, 'Title is too short')
        .max(70, 'Title is too long'),
    interval: Yup
        .mixed<PlanInterval>()
        .oneOf(Object.values(PlanInterval))
        .required(),
    value: Yup.number()
        .required('Value is required')
        .moreThan(0, "Value is too small")
        .max(MAX_DOLLARS, "Value is too high"),
    price: Yup.number()
        .required('Price is required')
        .moreThan(0, "Price is too small")
        .max(MAX_DOLLARS, "Price is too high"),
    description: Yup
        .string()
        .nullable()
        .min(0, 'Description is too short')
        .max(250, 'Description is too long'),
});

export const PlanIntervalDisplayValues: Record<PlanInterval, string> = {
    [PlanInterval.WEEKLY]: 'Weekly',
    [PlanInterval.MONTHLY]: 'Monthly',
  };
