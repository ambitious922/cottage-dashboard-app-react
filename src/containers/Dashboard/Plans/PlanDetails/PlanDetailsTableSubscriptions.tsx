import { useContext, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';

import {
  CancelSubscriptionInput,
  FilterSubscriptionsInput,
  GetPlanInput,
  getPlanSubscriptionsQuery,
  PaginationInput,
  SubscriptionCanceler,
} from 'API';
import { useGetPlanSubscriptions } from 'api/query-hooks/plans';
import { AppContext } from 'App';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { Spinner } from 'components/Common/Spinner';
import CottagePagination from 'components/Common/CottagePagination';
import PlanDetailTableHeader from './PlanDetailsTableHeader';
import CottageMenu from 'components/Common/CottageMenu';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { useCancelSubscription } from 'api/query-hooks/subscription';
import { SusbcriptionErrors } from 'models/error';
import { displayableDate } from 'utils';

interface IPlanDetailTableSusbcriptionsProps {
  planId: string;
}

interface SubscriptionModalState {
  visible: boolean;
  subscriptionId?: string;
  consumerId?: string;
}
export interface IPlanDetailsTableSubscriptionData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  locationId: string;
  locationTitle: string;
  consumerId: string;
}

const PlanDetailsTableSubscriptions: React.FC<IPlanDetailTableSusbcriptionsProps> = ({
  planId,
}) => {
  const { businessId } = useContext(AppContext);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalState, setModalState] = useState<SubscriptionModalState>({ visible: false });

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const planInput: GetPlanInput = {
    businessId,
    planId,
  };
  const filters: FilterSubscriptionsInput = {};
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const plansSubscriptionQuery = useGetPlanSubscriptions(planInput, filters, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getPlan?.subscriptions?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const pageInfo = plansSubscriptionQuery.data?.data?.getPlan?.subscriptions?.pageInfo;

  const subscriptionList: IPlanDetailsTableSubscriptionData[] =
    plansSubscriptionQuery.data?.data?.getPlan?.subscriptions?.edges.map((e) => {
      return {
        ...e.node,
        locationId: e.node.location.id,
        locationTitle: e.node.location.title,
      };
    }) || [];

  const subscriptions = subscriptionList || [];

  const handleCancelSubscriptionClick = (subscriptionId: string, consumerId: string) => {
    setModalState({ visible: true, subscriptionId, consumerId });
  };

  const cancelSubscriptionMutation = useCancelSubscription();

  const onCancelClick = () => {
    setErrorMessage('');
    setModalState({ ...modalState, visible: false });
  };

  const onCancelSubscription = async () => {
    setErrorMessage('');

    const { consumerId, subscriptionId } = modalState;

    if (!subscriptionId || !consumerId) {
      return;
    }

    const input: CancelSubscriptionInput = {
      businessId,
      consumerId,
      subscriptionId,
      canceledBy: SubscriptionCanceler.LOCATION,
    };

    try {
      await cancelSubscriptionMutation.mutateAsync(input);
      setModalState({ ...modalState, visible: false });
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      switch (code) {
        case SusbcriptionErrors.BusinessNotFoundErrorCode:
        case SusbcriptionErrors.SubscriptionNotFoundError:
        default:
          setErrorMessage('Something went wrong');
          break;
      }
    }
  };

  const renderTableBody = () => {
    if (plansSubscriptionQuery.isLoading) {
      return (
        <tr>
          <td colSpan={8}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (plansSubscriptionQuery.isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray whitespace-nowrap">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (subscriptions.length === 0) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray whitespace-nowrap">
            Nobody is currently subscribed to this plan.
          </td>
        </tr>
      );
    }

    return subscriptions.map((subscription) => (
      <>
        <tr key={subscription.id}>
          <td className="px-0 py-5 text-sm font-semibold text-left">
            {subscription.name}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {subscription.email}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {subscription.locationTitle}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {displayableDate(subscription.createdAt)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {displayableDate(subscription.currentPeriodStart)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {displayableDate(subscription.currentPeriodEnd)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-right">
            <CottageMenu
              menuOptions={[
                {
                  title: 'Cancel Subscription',
                  onClick: () =>
                    handleCancelSubscriptionClick(subscription.id, subscription.consumerId),
                },
              ]}
            />
          </td>
        </tr>
      </>
    ));
  };

  const totalSubscriptionString = `${
    plansSubscriptionQuery.isLoading ? '-' : subscriptions.length
  }`;

  return (
    <div className="flex flex-col my-6 text-darkGreen">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="p-6 overflow-hidden bg-white rounded-lg shadow-md">
            <PlanDetailTableHeader totalString={totalSubscriptionString} activeTab="subscribers" />
            <table className="min-w-full mt-6 divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left w-1/10">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left w-2/4">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Renewal Start
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Renewal End
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={plansSubscriptionQuery.isLoading}
              currentPageSize={subscriptionList.length}
              onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
              onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
              hasNextPage={!!pageInfo?.hasNextPage}
              hasPreviousPage={!!pageInfo?.hasPreviousPage}
              currentPageIndex={endCursorsIndex + 1}
            />
          </div>
          {modalState.visible && (
            <CottageConfirmationModal
              title={'Cancel Subscription'}
              message={
                'Are you sure you want to cancel this subscription? This customer will no longer be charged in the future. All current credits this customer owns will still be usable until they are depleted.'
              }
              confirmButtonText={'Cancel Subscription'}
              onConfirm={onCancelSubscription}
              onCancel={onCancelClick}
              isLoading={cancelSubscriptionMutation.isLoading}
              errorMessage={errorMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsTableSubscriptions;
