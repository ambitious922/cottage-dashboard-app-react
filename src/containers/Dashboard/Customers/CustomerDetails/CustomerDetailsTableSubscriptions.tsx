import { GraphQLResult } from '@aws-amplify/api';
import { useState } from 'react';

import {
  FilterSubscriptionsInput,
  GetConsumerInput,
  getConsumerSubscriptionsQuery,
  MonetaryValue,
  PaginationInput,
  PlanInterval,
  SubscriptionCollectionStatus,
  SubscriptionStatus,
} from 'API';
import { useGetConsumerSubscriptions } from 'api/query-hooks/consumer';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import CottagePagination from 'components/Common/CottagePagination';
import { Spinner } from 'components/Common/Spinner';
import {
  displayableDate,
  displayableDateMonthDay,
  displayableMonetaryValue,
  toCamelCase,
} from 'utils';

interface CustomerDetailTableTransactionsProps {
  consumerId?: string;
}

export interface ICustomerDetailsTableSubscriptionData {
  id: string;
  createdAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  status: SubscriptionStatus;
  collection: SubscriptionCollectionStatus;
  title: string;
  interval: PlanInterval;
  price: MonetaryValue;
  value: MonetaryValue;
}

const CustomerDetailsTableSubscriptions: React.FC<CustomerDetailTableTransactionsProps> = ({
  consumerId,
}) => {
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const getConsumerInput: GetConsumerInput = {
    consumerId,
  };
  const filters: FilterSubscriptionsInput = {
    status: SubscriptionStatus.ACTIVE,
  };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const consumerSubscriptionsQuery = useGetConsumerSubscriptions(
    getConsumerInput,
    filters,
    pagination,
    {
      onSettled: (data) => {
        const endCursor = data?.data?.getConsumer?.subscriptions?.pageInfo.endCursor;
        if (endCursor) {
          setEndCursors([...endCursors, endCursor]);
        }
      },
    }
  );

  const pageInfo = consumerSubscriptionsQuery.data?.data?.getConsumer?.subscriptions?.pageInfo;

  const subscriptionList: ICustomerDetailsTableSubscriptionData[] =
    consumerSubscriptionsQuery.data?.data?.getConsumer?.subscriptions?.edges.map((e) => {
      return {
        ...e.node,
        title: e.node.plan.title,
        interval: e.node.plan.interval,
        price: e.node.plan.price,
        value: e.node.plan.value,
      };
    }) || [];

  const renderTableBody = () => {
    if (consumerSubscriptionsQuery.isLoading) {
      return (
        <tr>
          <td colSpan={8}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (consumerSubscriptionsQuery.isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (subscriptionList.length === 0) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray">
            This customer is not signed up for any of your plans.
          </td>
        </tr>
      );
    }

    return subscriptionList.map((subscription) => (
      <>
        <tr key={subscription.id}>
          <td className="px-0 py-5 text-sm font-semibold text-left">{subscription.title}</td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {displayableDate(subscription.createdAt)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {subscription.collection === SubscriptionCollectionStatus.PAUSE
              ? toCamelCase(subscription.collection)
              : toCamelCase(subscription.status)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {toCamelCase(subscription.interval)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {displayableMonetaryValue(subscription.price)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left">
            {displayableMonetaryValue(subscription.value)}
          </td>
          <td className="px-0 py-5 text-xs font-normal text-left w-px whitespace-nowrap">
            {`${displayableDateMonthDay(
              subscription.currentPeriodStart
            )} - ${displayableDateMonthDay(subscription.currentPeriodEnd)}`}
          </td>
        </tr>
      </>
    ));
  };

  return (
    <div className="flex flex-col my-6 text-darkGreen">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
            <table className="min-w-full divide-y divide-gray-200 mt-6">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Purchased on
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Renews
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Value
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left w-px whitespace-nowrap">
                    Current Interval
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={consumerSubscriptionsQuery.isLoading}
              currentPageSize={subscriptionList.length}
              onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
              onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
              hasNextPage={!!pageInfo?.hasNextPage}
              hasPreviousPage={!!pageInfo?.hasPreviousPage}
              currentPageIndex={endCursorsIndex + 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsTableSubscriptions;
