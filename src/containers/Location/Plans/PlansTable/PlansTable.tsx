import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { MonetaryValue, PlanInterval, UpdatePlanInput } from 'API';
import Link from 'components/Common/Link';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';
import { Params } from 'constants/Routes';

import CouponTableHeader from '../PlanTableHeader';
import CottageMenu from 'components/Common/CottageMenu';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { useGetLocationPlans, useUpdatePlan } from 'api/query-hooks/plans';
import { displayableMonetaryValue, displayablePlanInterval } from 'utils';
import { Button } from '@chakra-ui/react';
import { PlanErrors } from 'models/error';

interface IPlanTableProps {}

interface PlanModalState {
  visible: boolean;
  planId?: string;
  planTitle?: string;
  locationIds?: string[];
}

export interface IPlanTableData {
  id: string;
  title: string;
  interval: PlanInterval;
  images: string[];
  price: MonetaryValue;
  value: MonetaryValue;
  description?: string | null;
  locationIds: string[];
}

const PlansTable: React.FC<IPlanTableProps> = () => {
  const { businessId, locationId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const history = useHistory();
  const [modalState, setModalState] = useState<PlanModalState>({ visible: false });
  const [errorMessage, setErrorMessage] = useState('');
  const locationPlansQuery = useGetLocationPlans({ id: locationId });
  const updatePlanMutation = useUpdatePlan();

  const planList: IPlanTableData[] = locationPlansQuery.data?.data?.getLocation?.plans || [];

  const handleOptOutPlanClick = (planId: string, planTitle: string, locationIds: string[]) => {
    setModalState({
      visible: true,
      planId,
      planTitle,
      locationIds,
    });
  };

  const onCancelClick = async () => {
    setErrorMessage('');
    setModalState({ visible: false });
  };

  const onOptOutPlanLocation = async () => {
    setErrorMessage('');

    if (!modalState.planId) {
      return;
    }

    const input: UpdatePlanInput = {
      businessId,
      planId: modalState.planId,
      locationIds: modalState.locationIds?.filter((lId) => lId !== locationId) || undefined,
    };

    try {
      await updatePlanMutation.mutateAsync(input);
      setModalState({ ...modalState, visible: false });
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case PlanErrors.PlanNotFoundErrorCode:
        case PlanErrors.BusinessNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      setErrorMessage(message);
    }
  };

  const renderTableBody = () => {
    if (locationPlansQuery.isLoading || locationPlansQuery.isFetching) {
      return (
        <tr>
          <td colSpan={5}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (locationPlansQuery.isError) {
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

    if (planList.length === 0) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            This location is not opted into any plans created by the business. To opt in go to the{' '}
            {
              <Button
                variant="link"
                fontSize="14px"
                fontWeight="400"
                colorScheme="cottage-green"
                className="text-lightGreen-100 font-semibold focus:shadow-none"
                onClick={() => history.push(`/business/${subdomain}/plans`)}>
                business plans page
              </Button>
            }
            , select a coupon and opt in under the Location Settings tab.
          </td>
        </tr>
      );
    }

    return planList.map((plan) => (
      <tr key={plan.id} className="cursor-default">
        <td className="px-2 py-5 text-sm font-medium text-darkGreen cursor-default">
          <Link to={`/business/${subdomain}/plans/${plan.id}`}>{plan.title}</Link>
        </td>
        <td className="px-2 py-5 text-sm text-gray-500 text-right">
          {displayablePlanInterval(plan.interval)}
        </td>
        <td className="px-2 py-5 text-sm text-gray-500 font-medium text-right">
          {displayableMonetaryValue(plan.value)}
        </td>
        <td className="px-2 py-5 text-sm text-gray-500 font-medium text-right">
          {displayableMonetaryValue(plan.price)}
        </td>
        <td className="px-0 py-5 text-xs font-normal text-right whitespace-nowrap">
          <CottageMenu
            menuOptions={[
              {
                title: 'Discontinue',
                onClick: () => handleOptOutPlanClick(plan.id, plan.title, plan.locationIds),
              },
            ]}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="px-4 mt-4 bg-white border-b border-gray-200 rounded-lg shadow">
      <CouponTableHeader totalPlans={planList.length} />
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Title
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Renews
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Credits
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Price
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      {modalState.visible && (
        <CottageConfirmationModal
          title={`Opt out of ${modalState.planTitle}`}
          message={
            'Customers will no longer be able to purchase this plan from this location after you opt out. You can always opt back in using the location settings tab under the business plan detail page. Active subscribers will be grandfathered in.'
          }
          confirmButtonText={'Confirm'}
          onConfirm={onOptOutPlanLocation}
          onCancel={onCancelClick}
          isLoading={updatePlanMutation.isLoading}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default PlansTable;
