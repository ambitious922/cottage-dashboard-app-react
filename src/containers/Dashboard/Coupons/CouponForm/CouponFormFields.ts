import * as Yup from 'yup';
import { CouponDuration, CouponType } from 'API';
import { MAX_DOLLARS } from 'constants/index';

export enum CreateCouponFormFields {
  name = 'Coupon Code',
  type = 'Coupon Type',
  amount = 'Amount',
  duration = 'Usage Limits',
  minimumTotal = 'Min. Purchase',
  description = 'Description',
}

export interface CouponFormValues {
  name: string;
  type: CouponType;
  amount?: number | null;
  duration: CouponDuration;
  minimumTotal?: number;
  description?: string | null;
}

export const CreateCouponFormValues: CouponFormValues = {
  name: '',
  type: CouponType.AMOUNT_OFF,
  amount: undefined,
  duration: CouponDuration.FOREVER,
  minimumTotal: undefined,
  description: '',
};

export const CreateCouponFormValidation = Yup.object().shape({
  name: Yup.string()
    .required('Coupon Code is required')
    .min(5, 'Coupon Code is too short')
    .max(20, 'Coupon Code is too long'),
  type: Yup.mixed<CouponType>().oneOf(Object.values(CouponType)).required(),
  amount: Yup.number()
    .required()
    .when(['type', 'minimumTotal'], (couponType, minimumTotal) => {
      if (couponType === CouponType.PERCENT_OFF) {
        return Yup.number()
          .min(0, 'Coupon percentage cannot be less than 0')
          .max(100, 'Coupon percentage cannot be greater than 100')
          .required('Coupon percentage is required.');
      }
      if (couponType === CouponType.AMOUNT_OFF) {
        return Yup.number()
          .min(1, 'Coupon Amount is too small')
          .max(minimumTotal, 'Amount off cannot be greater than the minimum purchase.')
          .required('Coupon amount is required.');
      }
      return Yup.number().notRequired();
    }),
  duration: Yup.mixed<CouponDuration>().oneOf(Object.values(CouponDuration)).required(),
  minimumTotal: Yup.number()
    .min(0, 'Minimum is too small')
    .max(MAX_DOLLARS, 'Minimum is too high')
    .required('Minimum is required'),
  description: Yup.string().nullable().max(250, 'Description cannot be longer than 250 characters'),
});

export const CouponTypeDisplayValues: Record<CouponType, string> = {
  [CouponType.AMOUNT_OFF]: 'Amount off',
  [CouponType.PERCENT_OFF]: 'Percent off',
  [CouponType.FREE_DELIVERY]: 'Free Delivery',
};

export const CouponDurationDisplayValues: Record<CouponDuration, string> = {
  [CouponDuration.FOREVER]: 'Unlimited',
  [CouponDuration.ONCE]: 'Single Use: Existing Customers',
  [CouponDuration.NEW]: 'Single Use: New Customers',
};
