import { Spinner } from 'components/Common/Spinner';
import {
  FilterSubscriptionInvoicesInput,
  GetBusinessInput,
  InvoiceStatus,
  PaginationInput,
} from 'API';
import { useGetBusinessSubscriptionInvoices } from 'api/query-hooks/subscriptioninvoice';
import { AppContext } from 'App';
import CottagePagination from 'components/Common/CottagePagination';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { useContext, useState } from 'react';

import SubscriptionsTableHeader from './SubscriptionsTableHeader/index';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import {
  displayableDate,
  displayableDateMonthDay,
  displayableTime,
  displayableMonetaryValue,
} from 'utils';

interface SubscriptionsTableProps {}

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = () => {
  const { businessId } = useContext(AppContext);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const [filters, setFilters] = useState<FilterSubscriptionInvoicesInput>({});

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const businessInput: GetBusinessInput = { businessId };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };
  const businessSubscriptionInvoicesQuery = useGetBusinessSubscriptionInvoices(
    businessInput,
    filters,
    pagination,
    {
      onSettled: (data) => {
        const endCursor = data?.data?.getBusiness?.subscriptionInvoices?.pageInfo.endCursor;
        if (endCursor) {
          setEndCursors([...endCursors, endCursor]);
        }
      },
    }
  );

  const pageInfo =
    businessSubscriptionInvoicesQuery.data?.data?.getBusiness?.subscriptionInvoices?.pageInfo;

  const subscriptionList =
    businessSubscriptionInvoicesQuery.data?.data?.getBusiness?.subscriptionInvoices?.edges.map(
      (e) => e.node
    ) || [];

  const renderTableBody = () => {
    if (businessSubscriptionInvoicesQuery.isLoading) {
      return (
        <tr>
          <td colSpan={8}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (businessSubscriptionInvoicesQuery.isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
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
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            No subscription invoices to display.
          </td>
        </tr>
      );
    }

    const getSubscriptionStatusColor = (status: InvoiceStatus) => {
      switch (status) {
        case InvoiceStatus.PAID:
          // green color
          return 'rgba(78, 162, 65, 0.2)';
        case InvoiceStatus.OPEN:
          // purple color
          return 'rgba(0, 21, 255, 0.2)';
        case InvoiceStatus.UNCOLLECTIBLE:
          // red color
          return 'rgba(240, 92, 81, 0.2)';
        default:
          return 'light-gray';
      }
    };

    return subscriptionList.map((subscriptionInvoice) => (
      <tr key={subscriptionInvoice.id}>
        <td className="px-2 py-5 text-xs font-semibold whitespace-nowrap">
          <div>{subscriptionInvoice.number}</div>
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          <div>{displayableDate(subscriptionInvoice.createdAt)}</div>
          <div>{displayableTime(subscriptionInvoice.createdAt)}</div>
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          <div>{`${displayableDateMonthDay(
            subscriptionInvoice.period.start
          )} - ${displayableDateMonthDay(subscriptionInvoice.period.end)}`}</div>
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          <div>{`${subscriptionInvoice.consumerFirstName} ${subscriptionInvoice.consumerLastName}`}</div>
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          <div>{subscriptionInvoice.consumerEmail}</div>
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          {subscriptionInvoice.cardLastFour || '--'}
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          <CottageTag
            title={subscriptionInvoice.invoiceStatus}
            tagType={CottageTagType.VIEW}
            tagColor={getSubscriptionStatusColor(subscriptionInvoice.invoiceStatus)}
          />
        </td>
        <td className="px-2 py-5 text-xs font-semibold whitespace-nowrap">
          {displayableMonetaryValue(subscriptionInvoice.cost?.total)}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <SubscriptionsTableHeader
        totalSubscriptionInvoices={subscriptionList.length}
        setFilters={setFilters}
      />
      <table className="min-w-full bg-white divide-y divide-gray-200 mt-2">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Invoice #
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Created
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Interval
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Customer
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Email
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Card
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Status
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      <CottagePagination
        isLoading={businessSubscriptionInvoicesQuery.isLoading}
        currentPageSize={subscriptionList.length}
        onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
        onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
        hasNextPage={!!pageInfo?.hasNextPage}
        hasPreviousPage={!!pageInfo?.hasPreviousPage}
        currentPageIndex={endCursorsIndex + 1}
      />
    </div>
  );
};

export default SubscriptionsTable;
