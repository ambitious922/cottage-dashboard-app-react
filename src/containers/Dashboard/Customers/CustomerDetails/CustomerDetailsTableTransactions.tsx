import { GraphQLResult } from '@aws-amplify/api';
import { useContext, useState } from 'react';

import {
  Credit,
  CreditStatus,
  FilterTransactionInput,
  GetConsumerInput,
  getConsumerTransactionsQuery,
  InvoiceStatus,
  MonetaryValue,
  OrderStatus,
  PaginationInput,
  TransactionType,
  TransitionOrderLocationCanceledInput,
  TransportationType,
} from 'API';
import { useGetConsumerTransactions } from 'api/query-hooks/consumer';
import { AppContext } from 'App';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import CustomerDetailsTableTransactionsHeader from './CustomerDetailsTableTransactionsHeader';
import CottagePagination from 'components/Common/CottagePagination';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import {
  displayableDateMonthDay,
  displayableTime,
  displayableMonetaryValue,
  toCamelCase,
} from 'utils';
import EditFormPopover from 'components/Common/EditFormPopover';
import OrderDetailsModal from 'containers/Dashboard/Modals/OrderDetailsModal';
import CreditDetailsModal from 'containers/Dashboard/Modals/CreditDetailsModal';
import RefundDetailsModal from 'containers/Dashboard/Modals/RefundDetailsModal';
import { Spinner } from 'components/Common/Spinner';
import SubscriptionInvoiceDetailsModal from 'containers/Dashboard/Modals/SubscriptionInvoiceDetailsModal';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { useTransitionOrderLocationCanceled } from 'api/query-hooks/order';
import { OrderErrors } from 'models/error';
import RefundForm from 'containers/Dashboard/Forms/RefundForm/RefundForm';

interface CustomerDetailTableTransactionsProps {
  consumerId?: string;
}

// TODO lack of consistency on these getters, low prio but clean up in the future
interface OrderDetailModalState {
  visible: boolean;
  cancelConfirmationVisible: boolean;
  refundConfirmationVisible: boolean;
  orderId?: string;
  locationId?: string;
  orderNumber?: string;
  total?: MonetaryValue;
}

interface SubscriptionInvoiceDetailModalState {
  visible: boolean;
  subscriptionInvoiceId?: string;
}

interface CreditDetailModalState {
  visible: boolean;
  credit?: Credit;
}

interface RefundDetailModalState {
  visible: boolean;
  refundId?: string;
}

const CustomerDetailsTableTransactions: React.FC<CustomerDetailTableTransactionsProps> = ({
  consumerId,
}) => {
  const { businessId } = useContext(AppContext);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const [orderDetailModalState, setOrderDetailModalState] = useState<OrderDetailModalState>({
    visible: false,
    cancelConfirmationVisible: false,
    refundConfirmationVisible: false,
  });
  const [susbcriptionInvoiceDetailModalState, setSusbcriptionInvoiceDetailModalState] =
    useState<SubscriptionInvoiceDetailModalState>({
      visible: false,
    });
  const [creditDetailModalState, setCreditDetailModalState] = useState<CreditDetailModalState>({
    visible: false,
  });
  const [refundDetailModalState, setRefundDetailModalState] = useState<RefundDetailModalState>({
    visible: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const transitionOrderCanceledMutation = useTransitionOrderLocationCanceled();

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const getConsumerInput: GetConsumerInput = {
    consumerId,
  };
  const filters: FilterTransactionInput = {
    types: [
      TransactionType.CREDIT,
      TransactionType.REFUND,
      TransactionType.ORDER,
      TransactionType.SUBSCRIPTION_INVOICE,
    ],
  };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const consumerTransactionsQuery = useGetConsumerTransactions(
    getConsumerInput,
    filters,
    pagination,
    {
      onSettled: (data) => {
        const endCursor = data?.data?.getConsumer?.transactions?.pageInfo.endCursor;
        if (endCursor) {
          setEndCursors([...endCursors, endCursor]);
        }
      },
    }
  );

  const pageInfo = consumerTransactionsQuery.data?.data?.getConsumer?.transactions?.pageInfo;

  const transactionList =
    consumerTransactionsQuery.data?.data?.getConsumer?.transactions?.edges.map((e) => e.node) || [];

  const { firstName, lastName } = consumerTransactionsQuery.data?.data?.getConsumer || {};

  const clearErrors = () => {
    setErrorMessage('');
  };

  const onCancelOrderCanceled = async () => {
    clearErrors();
    setOrderDetailModalState({
      ...orderDetailModalState,
      cancelConfirmationVisible: false,
    });
  };

  const onCancelOrderConfirmed = async () => {
    clearErrors();

    const { orderId, locationId } = orderDetailModalState;

    if (!orderId || !locationId) {
      return;
    }

    const input: TransitionOrderLocationCanceledInput = {
      businessId,
      locationId,
      orderId,
    };

    try {
      const { data } = await transitionOrderCanceledMutation.mutateAsync(input);
      setOrderDetailModalState({
        ...orderDetailModalState,
        cancelConfirmationVisible: false,
      });
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case OrderErrors.OrderStatusInvalidError:
          message =
            "This order's status cannot be changed. It may have just been changed by someone else, refresh to see the latest status.";
          break;
        case OrderErrors.BusinessNotActiveErrorCode:
        case OrderErrors.BusinessNotFoundErrorCode:
        case OrderErrors.LocationNotFoundErrorCode:
        case OrderErrors.OrderNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      setErrorMessage(message);
    }
  };

  const onRefundOrderCanceled = async () => {
    clearErrors();
    setOrderDetailModalState({
      ...orderDetailModalState,
      refundConfirmationVisible: false,
    });
  };

  const getOrderTypeColor = (orderType: any) => {
    switch (orderType) {
      case TransportationType.DELIVERY:
        return 'rgb(252, 220, 200)';
      case TransportationType.PICK_UP:
        return 'rgb(228, 238, 246)';
      default:
        return 'gray';
    }
  };

  const getOrderStatusColor = (orderStatus: any) => {
    switch (orderStatus) {
      case OrderStatus.LOCATION_CANCELED:
      case OrderStatus.CONSUMER_CANCELED_NOT_REFUNDED:
      case OrderStatus.CONSUMER_CANCELED_REFUNDED:
        return 'rgba(235, 98, 55, 0.2)';
      case OrderStatus.PURCHASED:
        return 'rgba(83, 99, 243, 0.2)';
      case OrderStatus.COMPLETED:
        return 'rgba(78, 162, 65, 0.2)';
      case InvoiceStatus.PAID:
        return 'rgba(78, 162, 65, 0.2)';
      case CreditStatus.SUCCEEDED:
        return 'rgba(78, 162, 65, 0.2)';
      default:
        return 'rgba(235, 98, 55, 0.2)';
    }
  };

  const renderTableBody = () => {
    if (consumerTransactionsQuery.isLoading) {
      return (
        <tr>
          <td colSpan={10}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (consumerTransactionsQuery.isError) {
      return (
        <tr>
          <td
            colSpan={10}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (transactionList.length === 0) {
      return (
        <tr>
          <td
            colSpan={10}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray">
            No transactions to display for this customer.
          </td>
        </tr>
      );
    }

    return transactionList.map((transaction) => {
      const t = transaction as any;
      if (t.transactionType === TransactionType.ORDER) {
        return (
          <tr
            key={t.id}
            className="hover:bg-lightGrey-100 cursor-pointer"
            onClick={() =>
              setOrderDetailModalState({
                ...orderDetailModalState,
                visible: true,
                orderId: t.id,
                locationId: t.locationId,
                orderNumber: t.number,
                total: t.cost.total,
              })
            }>
            <td className="px-0 py-5 text-sm font-semibold text-left">{t?.number}</td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {
                <CottageTag
                  title={t.orderStatus}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderStatusColor(t.orderStatus)}
                />
              }
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-left">
              {displayableDateMonthDay(t.createdAt)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-left flex items-center">
              {
                <CottageTag
                  title={t.orderType}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderTypeColor(t.orderType)}
                  variant={'outline'}
                />
              }{' '}
              @ {displayableTime(t.schedule.orderReadyStart)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.subtotal)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.netTotal)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.total)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.creditAmount)}
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-right">
              {displayableMonetaryValue(t.creditBalanceSnapshot)}
            </td>
          </tr>
        );
      } else if (t.transactionType === TransactionType.SUBSCRIPTION_INVOICE) {
        return (
          <tr
            key={t.id}
            className="hover:bg-lightGrey-100 cursor-pointer"
            onClick={() =>
              setSusbcriptionInvoiceDetailModalState({
                visible: true,
                subscriptionInvoiceId: t.id,
              })
            }>
            <td className="px-0 py-5 text-sm font-semibold text-left">{t.number}</td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {
                <CottageTag
                  title={t.invoiceStatus}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderStatusColor(t.invoiceStatus)}
                />
              }
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-left">
              {displayableDateMonthDay(t.createdAt)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {toCamelCase(t.transactionType)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.total)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.total)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.paymentTotal)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.creditTotal)}
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-right">
              {displayableMonetaryValue(t.creditBalanceSnapshot)}
            </td>
          </tr>
        );
      } else if (t.transactionType === TransactionType.CREDIT) {
        return (
          <tr
            key={t.id}
            className="hover:bg-lightGrey-100 cursor-pointer"
            onClick={() => setCreditDetailModalState({ visible: true, credit: t })}>
            <td className="px-0 py-5 text-sm font-semibold text-left">--</td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {
                <CottageTag
                  title={t.creditStatus}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderStatusColor(t.creditStatus)}
                />
              }
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-left">
              {displayableDateMonthDay(t.createdAt)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {toCamelCase(t.transactionType)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">--</td>
            <td className="px-0 py-5 text-xs font-normal text-right">--</td>
            <td className="px-0 py-5 text-xs font-normal text-right">--</td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.creditAmount)}
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-right">
              {displayableMonetaryValue(t.creditBalanceSnapshot)}
            </td>
          </tr>
        );
      } else if (t.transactionType === TransactionType.REFUND) {
        return (
          <tr
            key={t.id}
            className="hover:bg-lightGrey-100 cursor-pointer"
            onClick={() =>
              setRefundDetailModalState({
                visible: true,
                refundId: t.id,
              })
            }>
            <td className="px-0 py-5 text-sm font-semibold text-left">--</td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {
                <CottageTag
                  title={t.refundStatus}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderStatusColor(t.refundStatus)}
                />
              }
            </td>
            <td className="px-0 py-5 text-xs font-semibold text-left">
              {displayableDateMonthDay(t.createdAt)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-left">
              {toCamelCase(t.transactionType)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">--</td>
            <td className="px-0 py-5 text-xs font-normal text-right">
              {displayableMonetaryValue(t.cost?.paymentTotal)}
            </td>
            <td className="px-0 py-5 text-xs font-normal text-right">--</td>
            <td className="px-0 py-5 text-xs font-normal text-right">--</td>
            <td className="px-0 py-5 text-xs font-semibold text-right">
              {displayableMonetaryValue(t.creditBalanceSnapshot)}
            </td>
          </tr>
        );
      }
    });
  };

  const totalTransactionString = `${
    consumerTransactionsQuery.isLoading
      ? '--'
      : consumerTransactionsQuery.data?.data?.getConsumer?.transactions?.edges.length
  }`;

  return (
    <div className="flex flex-col my-6 text-darkGreen">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
            <CustomerDetailsTableTransactionsHeader totalString={totalTransactionString} />
            <table className="min-w-full divide-y divide-gray-200 mt-6">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Transaction #
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    {/** TODO add tooltip that explains this is before coupons/credits */}
                    Gross
                    <br />
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Transaction
                    <br />
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Customer
                    <br />
                    Paid
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Credit
                    <br />
                    Given
                  </th>
                  <th
                    scope="col"
                    className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Customer
                    <br />
                    Credit Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={consumerTransactionsQuery.isLoading}
              currentPageSize={transactionList.length}
              onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
              onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
              hasNextPage={!!pageInfo?.hasNextPage}
              hasPreviousPage={!!pageInfo?.hasPreviousPage}
              currentPageIndex={endCursorsIndex + 1}
            />
            {creditDetailModalState.visible && (
              <EditFormPopover
                isOpen={creditDetailModalState.visible}
                onClose={() =>
                  setCreditDetailModalState({
                    ...creditDetailModalState,
                    visible: false,
                  })
                }
                title={`Account Credit`}>
                <CreditDetailsModal
                  createdAt={creditDetailModalState.credit?.createdAt}
                  consumerFullName={`${firstName} ${lastName}`}
                  creditAmount={creditDetailModalState.credit?.cost?.creditAmount}
                  creditSnapshot={creditDetailModalState.credit?.creditBalanceSnapshot}
                  status={creditDetailModalState.credit?.creditStatus}
                  description={creditDetailModalState.credit?.description}
                  onClose={() =>
                    setCreditDetailModalState({
                      ...creditDetailModalState,
                      visible: false,
                    })
                  }
                />
              </EditFormPopover>
            )}
            {orderDetailModalState && (
              <EditFormPopover
                isOpen={orderDetailModalState.visible}
                onClose={() =>
                  setOrderDetailModalState({
                    ...orderDetailModalState,
                    visible: false,
                  })
                }
                title={`Order Details #${orderDetailModalState.orderNumber}`}>
                <OrderDetailsModal
                  orderId={orderDetailModalState.orderId}
                  locationId={orderDetailModalState.locationId}
                  onClose={() =>
                    setOrderDetailModalState({
                      ...orderDetailModalState,
                      visible: false,
                    })
                  }
                  onShowRefund={() => {
                    setOrderDetailModalState({
                      ...orderDetailModalState,
                      // this overlays on the already opened detail view
                      // pop up on a pop up looks good in this case
                      refundConfirmationVisible: true,
                    });
                  }}
                  onShowMarkCanceled={() => {
                    setOrderDetailModalState({
                      ...orderDetailModalState,
                      // this overlays on the already opened detail view
                      // pop up on a pop up looks good in this case
                      cancelConfirmationVisible: true,
                    });
                  }}
                />
              </EditFormPopover>
            )}
            {orderDetailModalState.refundConfirmationVisible && (
              <EditFormPopover
                isOpen={orderDetailModalState.visible}
                onClose={onRefundOrderCanceled}
                title={`Refund Order #${orderDetailModalState.orderNumber}`}>
                <RefundForm
                  consumerFullName={`${firstName} ${lastName}`}
                  consumerId={consumerId || ''}
                  locationId={orderDetailModalState.locationId || ''}
                  orderId={orderDetailModalState.orderId}
                  number={orderDetailModalState.orderNumber || ''}
                  total={orderDetailModalState.total}
                  onClose={onRefundOrderCanceled}
                />
              </EditFormPopover>
            )}
            {orderDetailModalState.cancelConfirmationVisible && (
              <CottageConfirmationModal
                title={`Cancel Order`}
                message={`An email confirmation will be sent to this customer letting them know you have canceled their order. This will NOT process a refund.`}
                confirmButtonText={'Mark as canceled'}
                onConfirm={onCancelOrderConfirmed}
                onCancel={onCancelOrderCanceled}
                isLoading={transitionOrderCanceledMutation.isLoading}
                errorMessage={errorMessage}
              />
            )}
            {refundDetailModalState.visible && (
              <EditFormPopover
                isOpen={refundDetailModalState.visible}
                onClose={() =>
                  setRefundDetailModalState({
                    ...refundDetailModalState,
                    visible: false,
                  })
                }
                title={`Refund Details`}>
                <RefundDetailsModal
                  refundId={refundDetailModalState.refundId}
                  consumerFullName={`${firstName} ${lastName}`}
                  onClose={() =>
                    setRefundDetailModalState({
                      ...refundDetailModalState,
                      visible: false,
                    })
                  }
                />
              </EditFormPopover>
            )}
            {susbcriptionInvoiceDetailModalState.visible && (
              <EditFormPopover
                isOpen={susbcriptionInvoiceDetailModalState.visible}
                onClose={() =>
                  setSusbcriptionInvoiceDetailModalState({
                    ...susbcriptionInvoiceDetailModalState,
                    visible: false,
                  })
                }
                title={`Subscription Invoice Details`}>
                <SubscriptionInvoiceDetailsModal
                  subscriptionInvoiceId={susbcriptionInvoiceDetailModalState.subscriptionInvoiceId}
                  onClose={() =>
                    setSusbcriptionInvoiceDetailModalState({
                      ...susbcriptionInvoiceDetailModalState,
                      visible: false,
                    })
                  }
                />
              </EditFormPopover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsTableTransactions;
