import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { CouponType, MonetaryValue, UpdateCouponInput } from 'API';
import Link from 'components/Common/Link';
import { useGetLocationCoupons, useUpdateCoupon } from 'api/query-hooks/coupon';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';
import { Params } from 'constants/Routes';

import CouponTableHeader from '../CouponTableHeader';
import CottageMenu from 'components/Common/CottageMenu';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { Button } from '@chakra-ui/react';
import { displayableMonetaryValue } from 'utils';
import { CouponErrors } from 'models/error';

interface ICouponTableProps {}

interface CouponModalState {
  visible: boolean;
  couponId?: string;
  couponName?: string;
  locationIds?: string[];
}
export interface ICouponTableData {
  id: string;
  type: CouponType;
  name: string;
  minimumTotal: MonetaryValue;
  locationIds: string[];
  percentOff?: number | null;
  amountOff?: MonetaryValue | null;
}

const CouponsTable: React.FC<ICouponTableProps> = () => {
  const { businessId, locationId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const history = useHistory();
  const [modalState, setModalState] = useState<CouponModalState>({ visible: false });
  const [errorMessage, setErrorMessage] = useState('');
  const locationCouponsQuery = useGetLocationCoupons({ id: locationId });
  const updateCouponMutation = useUpdateCoupon();

  const couponList: ICouponTableData[] =
    locationCouponsQuery.data?.data?.getLocation?.coupons || [];

  const handleOptOutCouponClick = (couponId: string, couponName: string, locationIds: string[]) => {
    setModalState({
      visible: true,
      couponId,
      couponName,
      locationIds,
    });
  };

  const onCancelClick = async () => {
    setErrorMessage('');
    setModalState({ visible: false });
  };

  const onOptOutCouponLocation = async () => {
    setErrorMessage('');

    if (!modalState.couponId) {
      return;
    }

    const input: UpdateCouponInput = {
      businessId,
      couponId: modalState.couponId,
      locationIds: modalState.locationIds?.filter((lId) => lId !== locationId) || undefined,
    };

    try {
      await updateCouponMutation.mutateAsync(input);
      setModalState({ ...modalState, visible: false });
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case CouponErrors.CouponNotFoundErrorCode:
        case CouponErrors.BusinessNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      setErrorMessage(message);
    }
  };

  const renderTableBody = () => {
    if (locationCouponsQuery.isLoading || locationCouponsQuery.isFetching) {
      return (
        <tr>
          <td colSpan={5}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (locationCouponsQuery.isError) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (couponList.length === 0) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            This location is not opted into any coupons created by the business. To opt in go to the{' '}
            {
              <Button
                variant="link"
                fontSize="14px"
                fontWeight="400"
                colorScheme="cottage-green"
                className="text-lightGreen-100 font-semibold focus:shadow-none"
                onClick={() => history.push(`/business/${subdomain}/coupons`)}>
                business coupons page
              </Button>
            }
            , select a coupon and opt in under the Location Settings tab.
          </td>
        </tr>
      );
    }

    return couponList.map((coupon) => (
      <tr key={coupon.id} className="cursor-default">
        <td className="px-2 py-5 text-sm font-medium text-darkGreen">
          <Link to={`/business/${subdomain}/coupons/${coupon.id}`}>{coupon.name}</Link>
        </td>
        <td className="px-2 py-5 text-sm text-gray-500">No date restrictions</td>
        <td className="px-2 py-5 text-sm text-gray-500 text-right">TODO</td>
        <td className="px-2 py-5 text-sm text-gray-500 font-medium text-right">
          {displayableMonetaryValue(coupon.minimumTotal)}
        </td>
        <td className="px-2 py-5 text-sm text-gray-500 font-medium text-right">
          {coupon.type === CouponType.AMOUNT_OFF ? (
            <span>{displayableMonetaryValue(coupon.amountOff)}</span>
          ) : (
            <span>{(coupon.percentOff || 0) * 100}%</span>
          )}
        </td>
        <td className="px-0 py-5 text-xs font-normal text-right whitespace-nowrap text-right">
          <CottageMenu
            menuOptions={[
              {
                title: 'Opt out',
                onClick: () => handleOptOutCouponClick(coupon.id, coupon.name, coupon.locationIds),
              },
            ]}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="px-4 mt-4 bg-white border-b border-gray-200 rounded-lg shadow">
      <CouponTableHeader totalCoupons={couponList.length} />
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Coupon Code
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Active Dates
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Used
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Min. Purchase
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Value Off
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      {modalState.visible && (
        <CottageConfirmationModal
          title={`Remove coupon ${modalState.couponName}`}
          message={
            'Are you sure you want to opt out of this coupon? Customers will no longer be able to use it after you opt out. You can always opt back in using the location settings tab under the business coupon detail page.'
          }
          confirmButtonText={'Confirm'}
          onConfirm={onOptOutCouponLocation}
          onCancel={onCancelClick}
          isLoading={updateCouponMutation.isLoading}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default CouponsTable;
