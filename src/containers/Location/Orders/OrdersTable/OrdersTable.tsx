import {
  Address,
  ByIdInput,
  FilterOrdersInput,
  getLocationOrdersQuery,
  OrderCost,
  OrderStatus,
  PaginationInput,
  TransportationType,
} from 'API';
import { useGetLocationOrders } from 'api/query-hooks/order';
import { AppContext } from 'App';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { useContext, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';

import OrdersTableHeader from '../OrdersTableHeader';
import { Spinner } from 'components/Common/Spinner';
import CottagePagination from 'components/Common/CottagePagination';
import OrderRow from './OrderRow';

interface OrdersTableProps {}

export interface IOrderTableData {
  id: string;
  orderNumber?: string | null;
  orderType: string;
  orderStatus: string;
  createdAt: string;
  orderReadyStart: string;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  cost: OrderCost;
}

const OrdersTable: React.FC<OrdersTableProps> = () => {
  const { locationId } = useContext(AppContext);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const locationInput: ByIdInput = { id: locationId };
  const filters: FilterOrdersInput = {
    statuses: [
      OrderStatus.PURCHASED,
      OrderStatus.CONSUMER_CANCELED_REFUNDED,
      OrderStatus.CONSUMER_CANCELED_NOT_REFUNDED,
      OrderStatus.LOCATION_CANCELED,
      OrderStatus.COMPLETED,
    ],
  };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };
  const locationOrdersQuery = useGetLocationOrders(locationInput, filters, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getLocation?.orders?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const pageInfo = locationOrdersQuery.data?.data?.getLocation?.orders?.pageInfo;

  const orderList =
    locationOrdersQuery.data?.data?.getLocation?.orders?.edges.map((e) => e.node) || [];

  const renderTableBody = () => {
    if (locationOrdersQuery.isLoading) {
      return (
        <tr>
          <td colSpan={9}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (locationOrdersQuery.isError) {
      return (
        <tr>
          <td
            colSpan={9}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (orderList.length === 0) {
      return (
        <tr>
          <td
            colSpan={9}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
            No orders to display.
          </td>
        </tr>
      );
    }

    return orderList.map((order) => (
      <OrderRow
        orderId={order.id}
        locationId={order.locationId}
        createdAt={order.createdAt}
        orderReadyStart={order.schedule.orderReadyStart}
        consumerFirstName={order.consumer.firstName}
        consumerLastName={order.consumer.lastName}
        consumerEmail={order.consumer.email}
        orderType={order.orderType}
        orderNumber={order.number}
        orderStatus={order.orderStatus}
        total={order.cost?.total}
        streetAddress={
          order.orderType === TransportationType.DELIVERY
            ? `${order.consumerAddress?.street} ${order.consumerAddress?.street2 || ''}`
            : `${order.pickupAddress?.street} ${order.consumerAddress?.street2 || ''}`
        }
      />
    ));
  };

  return (
    <div className="px-4 mt-4 bg-white border-b border-gray-200 rounded-lg shadow">
      <OrdersTableHeader totalOrders={orderList.length} />
      <table className="min-w-full bg-white divide-y divide-gray-200 mt-2">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Order #
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Schedule
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Customer / Email
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Address
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
            <th
              style={{ width: '115px' }}
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"></th>
            <th
              style={{ width: '115px' }}
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
              Mark complete
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      <CottagePagination
        isLoading={locationOrdersQuery.isLoading}
        currentPageSize={orderList.length}
        onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
        onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
        hasNextPage={!!pageInfo?.hasNextPage}
        hasPreviousPage={!!pageInfo?.hasPreviousPage}
        currentPageIndex={endCursorsIndex + 1}
      />
    </div>
  );
};

export default OrdersTable;
