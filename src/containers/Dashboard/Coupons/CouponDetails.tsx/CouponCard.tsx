import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { Container, Box, Stack } from '@chakra-ui/layout';
import { Button, Text, useToast } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

import { useArchiveCoupon, useUpdateCoupon } from 'api/query-hooks/coupon';
import {
  CouponType,
  CouponDuration,
  ArchiveCouponInput,
  CouponStatus,
  UpdateCouponInput,
} from 'API';
import { AppContext } from 'App';
import { Params } from 'constants/Routes';
import { CouponFormValues } from 'types/coupon';

import { displayableMonetaryValue } from 'utils';
import CottageTooltip from 'components/Common/CottageTooltip';
import { CouponErrors } from 'models/error';
import { errorToast } from 'components/Common/Toast';

export interface CouponCardProps {
  coupon: CouponFormValues;
  isGetCouponLoading: boolean;
  isGetCouponFetching: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  isGetCouponLoading,
  isGetCouponFetching,
}) => {
  const history = useHistory();
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const toast = useToast();
  const archiveCouponMutation = useArchiveCoupon();
  const updateCouponMutation = useUpdateCoupon();

  const isArchived = coupon.status === CouponStatus.ARCHIVED;

  const convertPercentage = (percent: number) => `${percent * 100}%`;

  const onEdit = () => history.push(`/business/${subdomain}/coupons/${coupon.id}/edit`);

  const onArchive = async () => {
    const input: ArchiveCouponInput = {
      couponId: coupon.id,
      businessId,
    };

    try {
      await archiveCouponMutation.mutateAsync(input);
    } catch (e) {
      throw e;
    }
  };

  const onUnarchive = async () => {
    const input: UpdateCouponInput = {
      couponId: coupon.id,
      businessId,
      status: CouponStatus.ACTIVE,
    };

    try {
      await updateCouponMutation.mutateAsync(input);
    } catch (e) {
      throw e;
    }
  };

  const onSubmit = async () => {
    try {
      return isArchived ? await onUnarchive() : await onArchive();
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case CouponErrors.CouponLimitExceededErrorCode:
          message =
            'Coupon limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        case CouponErrors.BusinessNotFoundErrorCode:
        case CouponErrors.CouponNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      errorToast(toast, message);
    }
  };

  const renderCouponTypeValue = () => {
    switch (coupon.type) {
      case CouponType.AMOUNT_OFF:
        return (
          <Text className="text-sm text-darkGreen font-normal">
            {displayableMonetaryValue(coupon.amountOff)}
          </Text>
        );
      case CouponType.PERCENT_OFF:
        return (
          <Text className="text-sm text-darkGreen font-normal">
            {coupon.percentOff ? convertPercentage(coupon.percentOff) : convertPercentage(0)}
          </Text>
        );
      case CouponType.FREE_DELIVERY:
        return <Text className="text-sm text-darkGreen font-normal">Free Delivery</Text>;
      default:
        return <Text>N/A</Text>;
    }
  };

  return (
    <Stack direction="column" spacing={4} className="shadow-md">
      <div className="bg-white pl-8 pr-6 py-6 w-full">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          className="block md:flex">
          <Box>
            <Text className="text-sm font-medium text-grey mb-3">Coupon Code</Text>
            <Text className="text-sm text-darkGreen font-semibold">{coupon.name}</Text>
            <Stack direction="row" spacing={85} className="block md:flex my-4">
              <Box alignItems="center">
                {' '}
                <Text className="text-sm font-medium text-grey mb-3">
                  {coupon.type === CouponType.FREE_DELIVERY
                    ? 'Type'
                    : coupon.type === CouponType.AMOUNT_OFF
                    ? 'Amount Off'
                    : 'Percent Off'}
                </Text>
                <Text className="text-base text-darkGreen font-normal">
                  {renderCouponTypeValue()}
                </Text>
              </Box>
              <Box alignItems="center" className="ml-0 sm:ml-24 mt-4 sm:mt-0">
                <Text className="flex items-center gap-1.5 text-sm font-medium text-grey mb-3">
                  Minimum Purchase&nbsp;
                  <CottageTooltip text="The customer must reach this value in order to be eligible for this coupon" />
                </Text>
                <Text className="text-sm text-darkGreen font-normal">
                  {coupon.minimumTotal ? displayableMonetaryValue(coupon.minimumTotal) : 'None'}
                </Text>
              </Box>
              <Box alignItems="center" className="ml-0 sm:ml-24 mt-4 sm:mt-0">
                <Text className="flex items-center gap-1.5 text-sm font-medium text-grey mb-3">
                  Usage Limits
                </Text>
                <Text className="text-sm text-darkGreen font-normal">
                  {coupon.duration === CouponDuration.FOREVER && 'Unlimited'}
                  {coupon.duration === CouponDuration.ONCE && 'Single Use'}
                </Text>
              </Box>
            </Stack>
            <Container paddingStart={0} minW="xl">
              <Text className="text-sm font-medium text-grey mb-3">Description</Text>
              <Text className="text-sm font-normal text-darkGray my-3">
                {coupon?.description ? coupon.description : '-'}
              </Text>
            </Container>
          </Box>
          <Box className="ml-0 mt-4 sm:mt-0">
            <Stack direction="column" spacing={2}>
              <Button
                fontSize="14px"
                fontWeight="600"
                className="h-9 text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
                onClick={onEdit}
                minW="200"
                leftIcon={<PencilIcon className="w-4 h-4" />}>
                Edit Details
              </Button>
              <Button
                fontSize="14px"
                fontWeight="600"
                className="h-9 text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
                minW="200"
                onClick={() => onSubmit()}
                leftIcon={<TrashIcon className="w-5 h-5" />}
                isLoading={
                  archiveCouponMutation.isLoading ||
                  updateCouponMutation.isLoading ||
                  isGetCouponLoading ||
                  isGetCouponFetching
                }>
                {isArchived ? 'Unarchive Coupon' : 'Archive Coupon'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </div>
    </Stack>
  );
};

export default CouponCard;
