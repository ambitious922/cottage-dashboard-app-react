import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ContainerHeader from 'components/Common/ContainerHeader';
import CouponCard from './CouponCard';
import CottageAlert, { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { AppContext } from 'App';
import { CouponStatus, GetCouponInput } from 'API';
import { useGetCoupon } from 'api/query-hooks/coupon';
import { CouponFormValues } from 'types/coupon';
import { Container, Spinner } from '@chakra-ui/react';
import CouponDetailsTable from './CouponDetailsTable';
import DashboardNotFound from 'containers/DashboardNotFound';

export interface CouponDetailsProps {}

const CouponDetails: React.FC<CouponDetailsProps> = () => {
  const params: { couponId: string; subdomain: string } = useParams();
  const history = useHistory();
  const { businessId } = useContext(AppContext);

  const { couponId, subdomain } = params;

  const couponsInput: GetCouponInput = {
    businessId,
    couponId,
  };

  const { data, isLoading, isFetching, isError } = useGetCoupon(couponsInput);
  const coupon: CouponFormValues | null | undefined = data?.data?.coupon;

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !coupon) {
    // TODO show this component wherever necessary
    return <DashboardNotFound />;
  }

  const isArchived = coupon.status === CouponStatus.ARCHIVED;

  const onBackClick = () => history.push(`/business/${subdomain}/coupons`);

  return (
    <div className="px-2 md:px-7 py-2 font-sans text-darkGreen">
      <ContainerHeader headerText="Back to Coupons" onBackClick={onBackClick} />
      <div className="p-2 md:pt-14 md:pb-0 md:px-10">
        <CouponCard
          coupon={coupon}
          isGetCouponLoading={isLoading}
          isGetCouponFetching={isFetching}
        />
        {isArchived && (
          <Container height="fit-content" minW="fit-content" className="w-full max-w-full p-0 mt-4">
            <CottageAlert severity={AlertSeverity.SOFTINFO}>
              <b>This coupon is archived</b>. It will not be accepted if a customer tries to use it
              during checkout at any of your participating locations below.
            </CottageAlert>
          </Container>
        )}
      </div>
      <CouponDetailsTable couponId={couponId} />
    </div>
  );
};

export default CouponDetails;
