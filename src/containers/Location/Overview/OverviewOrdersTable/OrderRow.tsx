import { useContext, useState } from 'react';
import { Button, IconButton } from '@chakra-ui/react';
import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/react/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/solid';
import { MonetaryValue, OrderStatus, TransitionOrderCompleteInput, TransportationType } from 'API';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { displayableDate, displayableTime, displayableMonetaryValue } from 'utils/index';
import OrderRowDetails from './OrderRowDetails';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { AppContext } from 'App';
import { useTransitionOrderComplete } from 'api/query-hooks/order';
import { OrderErrors } from 'models/error';

export interface IOrderRowProps {
  orderId: string;
  locationId: string;
  createdAt: string;
  orderReadyStart: string;
  consumerFirstName: string;
  consumerLastName: string;
  consumerEmail: string;
  orderType: TransportationType;
  orderNumber?: string | null;
  orderStatus: OrderStatus;
  streetAddress: string;
  total: MonetaryValue | null | undefined;
}

const disabledIconStatuses = new Set([
  OrderStatus.COMPLETED,
  OrderStatus.LOCATION_CANCELED,
  OrderStatus.CONSUMER_CANCELED_REFUNDED,
  OrderStatus.CONSUMER_CANCELED_NOT_REFUNDED,
]);

const displayableStatusMap = new Map<OrderStatus, string | undefined>([
  [OrderStatus.COMPLETED, OrderStatus.COMPLETED],
  [OrderStatus.PURCHASED, OrderStatus.PURCHASED],
  [OrderStatus.IN_REVIEW, OrderStatus.IN_REVIEW],
  [OrderStatus.LOCATION_CANCELED, 'CANCELED'],
  [OrderStatus.CONSUMER_CANCELED_REFUNDED, 'CANCELED'],
  [OrderStatus.CONSUMER_CANCELED_NOT_REFUNDED, 'CANCELED'],
]);

const OrderRow: React.FC<IOrderRowProps> = ({
  orderId,
  locationId,
  createdAt,
  orderReadyStart,
  consumerFirstName,
  consumerLastName,
  consumerEmail,
  orderType,
  orderNumber,
  orderStatus,
  streetAddress,
  total,
}) => {
  const { businessId } = useContext(AppContext);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderStatusState, setOrderStatusState] = useState<OrderStatus>(orderStatus); // to avoid invalidating query after order is marked as complete
  const transitionOrderComplete = useTransitionOrderComplete();

  const getOrderTypeColor = () => {
    switch (orderType) {
      case TransportationType.DELIVERY:
        return 'rgb(252, 220, 200)';
      case TransportationType.PICK_UP:
        return 'rgb(228, 238, 246)';
      default:
        return 'gray';
    }
  };

  const getOrderStatusColor = () => {
    switch (orderStatusState) {
      case OrderStatus.LOCATION_CANCELED:
      case OrderStatus.CONSUMER_CANCELED_NOT_REFUNDED:
      case OrderStatus.CONSUMER_CANCELED_REFUNDED:
        return 'rgba(235, 98, 55, 0.2)';
      case OrderStatus.PURCHASED:
        return 'rgba(83, 99, 243, 0.2)';
      case OrderStatus.COMPLETED:
        return 'rgba(78, 162, 65, 0.2)';
      default:
        return 'gray';
    }
  };

  const renderOrderCompleteIcon = () => {
    switch (orderStatusState) {
      case OrderStatus.PURCHASED:
        return <CheckCircleIconOutline className="w-7 h-7" />;
      case OrderStatus.COMPLETED:
        return <CheckCircleIconSolid className="w-7 h-7" />;
      case OrderStatus.CONSUMER_CANCELED_REFUNDED:
      case OrderStatus.CONSUMER_CANCELED_NOT_REFUNDED:
      case OrderStatus.LOCATION_CANCELED:
        // this should render a faded icon
        return <CheckCircleIconSolid className="w-7 h-7 opacity-30" />;
    }
  };

  const onCancelClick = () => {
    setErrorMessage('');
    setConfirmCompleteModal(false);
  };

  const onCompleteOrder = async () => {
    setErrorMessage('');

    if (!orderId || !locationId) {
      return;
    }

    const input: TransitionOrderCompleteInput = {
      businessId,
      locationId,
      orderId,
    };

    try {
      const { data } = await transitionOrderComplete.mutateAsync(input);
      const updatedOrderStatus =
        data?.transitionOrderComplete?.order?.orderStatus || orderStatusState;
      setOrderStatusState(updatedOrderStatus);
      setConfirmCompleteModal(false);
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

  return (
    <>
      <tr
        key={orderId}
        style={{
          background:
            orderStatusState === OrderStatus.COMPLETED ? 'rgba(78, 162, 65, 0.05)' : 'white',
        }}>
        <td className="px-2 py-5 text-xs whitespace-nowrap">
          <div className="font-semibold">{orderNumber}</div>
          <div className="font-normal">Created {displayableDate(createdAt)}</div>
        </td>
        <td className="px-2 py-5 text-xs whitespace-nowrap">
          <div className="font-semibold">{displayableDate(orderReadyStart)}</div>
          <div className="font-semibold">{displayableTime(orderReadyStart)}</div>
        </td>
        <td className="px-2 py-5 text-xs whitespace-nowrap">
          <div className="font-semibold">{`${consumerFirstName} ${consumerLastName}`}</div>
          <div className="font-normal">{consumerEmail}</div>
        </td>
        <td className="px-2 py-5 text-xs font-normal whitespace-nowrap">
          <div>{streetAddress}</div>
          <CottageTag
            title={orderType}
            tagType={CottageTagType.VIEW}
            tagColor={getOrderTypeColor()}
            textSize={'10px'}
            textUpperCase={true}
            marginTop={'6px'}
            variant={'outline'}
          />
        </td>
        <td className="px-2 py-5 text-xs whitespace-nowrap">
          <CottageTag
            title={displayableStatusMap.get(orderStatusState) || orderStatusState}
            tagType={CottageTagType.VIEW}
            tagColor={getOrderStatusColor()}
          />
        </td>
        <td className="px-2 py-5 text-xs font-semibold whitespace-nowrap">
          {displayableMonetaryValue(total)}
        </td>
        <td className="px-2 py-5 text-xs whitespace-nowrap text-center">
          <Button
            variant="link"
            fontSize="12px"
            fontWeight="400"
            className="focus:outline-none focus:shadow-none"
            colorScheme="cottage-green"
            onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'View Details'}
          </Button>
        </td>
        <td className="px-2 py-5 text-xs whitespace-nowrap text-center">
          <IconButton
            variant="outline"
            border="none"
            colorScheme="green"
            aria-label="Complete Order"
            disabled={disabledIconStatuses.has(orderStatusState)}
            icon={renderOrderCompleteIcon()}
            className="hover:bg-transparent focus:outline-none focus:shadow-none"
            onClick={() => setConfirmCompleteModal(true)}
          />
        </td>
      </tr>
      {showDetails && (
        <OrderRowDetails
          orderId={orderId}
          locationId={locationId}
          orderStatus={orderStatus}
          onNewStatus={(newStatus) => setOrderStatusState(newStatus)}
          cancelMessage={`An email confirmation will be sent to ${consumerFirstName} ${consumerLastName} letting them know you have canceled their order. This will NOT process a refund. Go to ${consumerFirstName} ${consumerLastName}'s customer detail page to apply a refund.`}
        />
      )}
      {confirmCompleteModal && (
        <CottageConfirmationModal
          title={`Complete Order: ${orderNumber}`}
          message={`An email confirmation will be sent to ${consumerFirstName} ${consumerLastName} letting them know you have completed their order. Once marked as complete the order will remain in this state.`}
          confirmButtonText={'Complete Order'}
          onConfirm={onCompleteOrder}
          onCancel={onCancelClick}
          isLoading={transitionOrderComplete.isLoading}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default OrderRow;
