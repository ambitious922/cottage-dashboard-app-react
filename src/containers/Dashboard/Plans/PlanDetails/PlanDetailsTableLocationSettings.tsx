import { useContext, useState } from 'react';

import { GetBusinessInput, GetPlanInput, PlanStatus, UpdatePlanInput } from 'API';
import {
  useGetPlanLocations,
  useGetPlanLocationsStatistics,
  useUpdatePlanLocations,
} from 'api/query-hooks/plans';
import { AppContext } from 'App';
import { Button, Skeleton } from '@chakra-ui/react';
import CottageChecklistDialog from 'components/Common/CottageChecklistDialog';
import { useGetBusinessLocations } from 'api/query-hooks/business';
import { ChecklistItem } from 'components/Common/CottageChecklistDialog/CottageChecklistDialog';
import { Spinner, SpinnerSize } from 'components/Common/Spinner';
import PlanDetailTableHeader from './PlanDetailsTableHeader';
import { PlanErrors } from 'models/error';

interface PlanDetailTableLocationSettingsProps {
  planId: string;
}

const PlanDetailsTableLocationSettings: React.FC<PlanDetailTableLocationSettingsProps> = ({
  planId,
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

  const planInput: GetPlanInput = {
    businessId,
    planId,
  };

  const plansLocationQuery = useGetPlanLocations(planInput);
  const plansLocationsStatisticsQuery = useGetPlanLocationsStatistics(planInput);

  const updatePlanLocationsMutation = useUpdatePlanLocations();

  const selectedLocationsList = plansLocationQuery.data?.data?.getPlan?.locations || [];

  const planStatus: PlanStatus | undefined = plansLocationQuery.data?.data?.getPlan?.status;

  const onCancelClick = () => {
    setErrorMessage('');
    setShowLocationSettingsModal(false);
  };
  const onSubmit = async (selectedLocations: ChecklistItem[]) => {
    setErrorMessage('');

    const locationIds = selectedLocations.map((selectedLocation) => selectedLocation.id) || [];
    const input: UpdatePlanInput = {
      planId,
      businessId,
      locationIds,
    };

    try {
      await updatePlanLocationsMutation.mutateAsync(input);
      setShowLocationSettingsModal(false);
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      switch (code) {
        case PlanErrors.BusinessNotFoundErrorCode:
        case PlanErrors.PlanNotFoundErrorCode:
        default:
          setErrorMessage('Something went wrong');
          break;
      }
    }
  };

  const renderTableBody = () => {
    if (plansLocationQuery.isLoading || businessLocationQuery.isLoading) {
      return (
        <tr>
          <td colSpan={4}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (plansLocationQuery.isError || businessLocationQuery.isError) {
      return (
        <tr>
          <td
            colSpan={4}
            className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            This plan is not currently available to any location.
          </td>
        </tr>
      );
    }

    if (selectedLocationsList.length === 0) {
      return (
        <tr>
          <td
            colSpan={4}
            className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            This plan is not currently available to any location.
          </td>
        </tr>
      );
    }

    const locationStatistics =
      plansLocationsStatisticsQuery.data?.data?.getPlan?.locationStatistics;

    return selectedLocationsList.map((location) => (
      <tr key={location.id}>
        <td className="px-0 py-4 text-sm font-sans font-semibold text-darkGreen text-left whitespace-nowrap">
          {location.title}
        </td>
        <td className="px-0 py-4 text-sm font-sans font-normal text-darkGreen text-right whitespace-nowrap">
          TODO
        </td>
        <td className="px-0 py-4 text-sm font-sans font-normal text-darkGreen text-right whitespace-nowrap">
          {plansLocationsStatisticsQuery.isLoading ? (
            // <Spinner size={SpinnerSize.XSMALL} />
            <Skeleton height="10px" width="50px" ml="auto" />
          ) : (
            locationStatistics?.find((ls) => ls.locationId === location.id)?.pausedSubscriptionCount
          )}
        </td>
        <td className="px-0 py-4 text-sm font-sans font-normal text-darkGreen text-right whitespace-nowrap">
          {plansLocationsStatisticsQuery.isLoading ? (
            // <Spinner size={SpinnerSize.XSMALL} />
            <Skeleton height="10px" width="50px" ml="auto" />
          ) : (
            locationStatistics?.find((ls) => ls.locationId === location.id)?.activeSubscriptionCount
          )}
        </td>
      </tr>
    ));
  };

  const totalLocationsString = `${
    plansLocationQuery.isLoading || businessLocationQuery.isLoading
      ? '-'
      : selectedLocationsList.length
  }`;

  return (
    <div className="flex flex-col my-6 text-darkGreen">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
            <PlanDetailTableHeader
              totalString={totalLocationsString}
              activeTab="locations"
              isDisabled={plansLocationQuery.isLoading || planStatus === PlanStatus.ARCHIVED}
              onClickHandle={() => setShowLocationSettingsModal(true)}
            />
            <table className="min-w-full divide-y divide-gray-200 mt-3">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-left text-darkGreen w-2/4">
                    Location Title
                  </th>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-right text-darkGreen">
                    Total Plan Revenue
                  </th>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-right text-darkGreen">
                    Active Subscribers
                  </th>
                  <th
                    scope="col"
                    className="px-0 py-3 text-xs font-sans font-semibold tracking-wider text-right text-darkGreen">
                    Paused Subscribers
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
          errorMessage={errorMessage}
          isOpen={showLocationSettingsModal}
          headerText={'Select locations to sell this plan'}
          primaryButtonText={'Save selected locations'}
          initiallySelectedOptions={selectedLocationsList.map((l) => l.title)}
          allOptions={allLocationsList}
          isLoading={updatePlanLocationsMutation.isLoading}
        />
      )}
    </div>
  );
};

export default PlanDetailsTableLocationSettings;
