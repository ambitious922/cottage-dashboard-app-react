import { Button } from '@chakra-ui/react';
import { CouponStatus, GetBusinessInput, GetCouponInput, UpdateCouponInput } from 'API';
import { useGetBusinessLocations } from 'api/query-hooks/business';
import { useGetCouponLocations, useUpdateCouponLocations } from 'api/query-hooks/coupon';
import { AppContext } from 'App';
import CottageChecklistDialog, {
  ChecklistItem,
} from 'components/Common/CottageChecklistDialog/CottageChecklistDialog';
import { useContext, useState } from 'react';
import { Spinner } from 'components/Common/Spinner';
import CouponDetailTableHeader from './CouponDetailsTableHeader';
import { CouponErrors } from 'models/error';

interface CouponDetailTableLocationSettingsProps {
  couponId: string;
}

const CouponDetailsTableLocationSettings: React.FC<CouponDetailTableLocationSettingsProps> = ({
  couponId,
}) => {
  const { businessId } = useContext(AppContext);
  const [showLocationSettingsModal, setShowLocationSettingsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const businessInput: GetBusinessInput = { businessId };
  const businessLocationQuery = useGetBusinessLocations(businessInput);

  const allLocationsList: ChecklistItem[] =
    businessLocationQuery.data?.data?.getBusiness?.locations?.edges?.map((e) => {
      return {
        id: e.node.id,
        title: e.node.title,
      };
    }) || [];

  const couponInput: GetCouponInput = {
    businessId,
    couponId,
  };

  const updateCouponLocationsMutation = useUpdateCouponLocations();
  const couponsLocationQuery = useGetCouponLocations(couponInput);

  const selectedLocationsList = couponsLocationQuery.data?.data?.coupon?.locations || [];

  const couponStatus: CouponStatus | undefined = couponsLocationQuery.data?.data?.coupon?.status;

  const onCancelClick = () => {
    setErrorMessage('');
    setShowLocationSettingsModal(false);
  };
  const onSubmit = async (selectedLocations: ChecklistItem[]) => {
    setErrorMessage('');

    const locationIds = selectedLocations.map((selectedLocation) => selectedLocation.id);
    const input: UpdateCouponInput = {
      couponId,
      businessId,
      locationIds,
    };

    try {
      await updateCouponLocationsMutation.mutateAsync(input);
      setShowLocationSettingsModal(false);
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      switch (code) {
        case CouponErrors.BusinessNotFoundErrorCode:
        case CouponErrors.CouponNotFoundErrorCode:
        default:
          setErrorMessage('Something went wrong');
          break;
      }
    }
  };

  const renderTableBody = () => {
    if (couponsLocationQuery.isLoading || businessLocationQuery.isLoading) {
      return (
        <tr>
          <td colSpan={3}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (couponsLocationQuery.isError || businessLocationQuery.isError) {
      return (
        <tr>
          <td
            colSpan={3}
            className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            This coupon is not currently available at any location.
          </td>
        </tr>
      );
    }

    if (selectedLocationsList.length === 0) {
      return (
        <tr>
          <td
            colSpan={3}
            className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            This coupon is not currently available at any location.
          </td>
        </tr>
      );
    }

    // TODO bug here this is not displaying
    return selectedLocationsList.map((location) => (
      <tr key={location.id}>
        <td className="px-0 py-4 text-sm font-sans font-semibold text-darkGreen text-left whitespace-nowrap">
          {location.title}
        </td>
        <td className="px-0 py-4 text-sm font-sans font-medium text-darkGreen text-right whitespace-nowrap">
          TODO
        </td>
        <td className="px-0 py-4 text-sm font-sans font-medium text-darkGreen text-right whitespace-nowrap">
          TODO
        </td>
      </tr>
    ));
  };

  const totalLocationsString = `${
    couponsLocationQuery.isLoading ? '-' : selectedLocationsList.length
  }`;

  return (
    <div className="flex flex-col my-6 text-darkGreen">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-md rounded-lg p-6 pt-4">
            <CouponDetailTableHeader
              totalOrdersString={totalLocationsString}
              activeTab="locations"
              isDisabled={couponsLocationQuery.isLoading || couponStatus === CouponStatus.ARCHIVED}
              onClickHandle={() => setShowLocationSettingsModal(true)}
            />
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-left text-darkGreen w-3/4">
                    Location Title
                  </th>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-right text-darkGreen">
                    Redeemed
                  </th>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-right text-darkGreen">
                    Total Saved
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
          </div>
        </div>
      </div>
      {showLocationSettingsModal && (
        <CottageChecklistDialog
          onClose={onCancelClick}
          onSubmit={onSubmit}
          isOpen={showLocationSettingsModal}
          headerText={'Select locations to offer this coupon'}
          primaryButtonText={'Save selected locations'}
          initiallySelectedOptions={selectedLocationsList.map((l) => l.title)}
          allOptions={allLocationsList}
          isLoading={updateCouponLocationsMutation.isLoading}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default CouponDetailsTableLocationSettings;
