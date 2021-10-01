import { CurrencyAbbreviation, CouponStatus, CouponType, CouponDuration, MonetaryValue } from "API";

export type CouponFormValues = {
    id: string,
    name: string,
    status: CouponStatus,
    type: CouponType,
    duration: CouponDuration,
    minimumTotal: MonetaryValue,
    description?: string | null,
    percentOff?: number | null,
    amountOff?: MonetaryValue | null,
};