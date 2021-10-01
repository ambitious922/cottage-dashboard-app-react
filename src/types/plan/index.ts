import { CurrencyAbbreviation, MonetaryValue, PlanInterval, PlanStatus } from "API";

export type PlanFormValues = {
    id: string,
    createdAt: string,
    updatedAt: string,
    status: PlanStatus,
    title: string,
    interval: PlanInterval,
    images: Array< string >,
    description?: string | null,
    price: MonetaryValue,
    value: MonetaryValue,
};