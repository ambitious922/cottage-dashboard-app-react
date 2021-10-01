import { CouponType, GetCouponInput } from 'API';
import { useGetCoupon } from 'api/query-hooks/coupon';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';
import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import CouponForm from '../CouponForm';
import { CouponFormValues } from '../CouponForm/CouponFormFields';

export interface EditCouponProps {}

const EditCoupon: React.FC<EditCouponProps> = () => {
  const params: { couponId: string; subdomain: string } = useParams();
  const { couponId, subdomain } = params;
  const { businessId } = useContext(AppContext);

  const couponInput: GetCouponInput = {
    businessId,
    couponId,
  };

  const couponQuery = useGetCoupon(couponInput);
  const { data, isLoading, isError } = couponQuery;

  if (isLoading) {
    return <Spinner />;
  }

  const coupon = data?.data?.coupon;

  if (isError || !coupon) {
    return <div>Something went wrong</div>;
  }

  const couponFormValues: CouponFormValues = {
    name: coupon.name,
    type: coupon.type,
    duration: coupon.duration,
    minimumTotal: coupon.minimumTotal.amount,
    description: coupon.description || '',
  };

  if (coupon.type === CouponType.PERCENT_OFF && coupon.percentOff) {
    couponFormValues.amount = coupon.percentOff * 100;
  } else if (coupon.type === CouponType.AMOUNT_OFF) {
    couponFormValues.amount = coupon.amountOff?.amount;
  }

  return (
    <div
      className="font-sans"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        color: '#102D29',
      }}>
      <CouponForm couponId={couponId} couponFormValues={couponFormValues} />
    </div>
  );
};

export default EditCoupon;
