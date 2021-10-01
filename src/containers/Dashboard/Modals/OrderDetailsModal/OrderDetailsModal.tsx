import { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Box } from '@chakra-ui/react';
import {
  OrderStatus,
  CreditStatus,
  InvoiceStatus,
  GetOrderInput,
  TransportationType,
  MonetaryValue,
} from 'API';
import { AppContext } from 'App';
import { useGetOrder } from 'api/query-hooks/order';
import { displayableDate, displayableTime, displayableMonetaryValue } from 'utils';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { Spinner } from 'components/Common/Spinner';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { InformationCircleIcon } from '@heroicons/react/outline';

export interface IOrderDetailsProps {
  orderId: string | undefined;
  locationId: string | undefined;
  onClose: () => void;
  onShowRefund: () => void;
  onShowMarkCanceled: () => void;
}

const OrderDetailsModal: React.FC<IOrderDetailsProps> = ({
  orderId,
  locationId,
  onClose,
  onShowRefund,
  onShowMarkCanceled,
}) => {
  const { businessId } = useContext(AppContext);
  const [keyMap] = useState(new Map());

  if (!orderId || !locationId) {
    return <div></div>;
  }

  const getOrderInput: GetOrderInput = {
    businessId,
    locationId,
    orderId,
  };

  const { data, isLoading, isError } = useGetOrder(getOrderInput);
  const order = data?.data?.order;

  order?.orderItems.forEach((item) => {
    keyMap.set(item, uuidv4());
  });

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  if (isError || !order) {
    console.warn(isError);
    return (
      <Box>
        <div className="text-center text-sm text-darkGray">Something went wrong</div>
      </Box>
    );
  }

  const constructAddress = () => {
    const { consumerAddress, pickupAddress } = order;
    const address = !!consumerAddress ? consumerAddress : pickupAddress;
    return (
      <div>
        <div>{`${address?.street} ${address?.street2 || ''}`}</div>
        <div>{address?.city}</div>
        <div>{`${address?.stateOrProvince}, ${address?.postalCode}`}</div>
      </div>
    );
  };

  const renderOrderItems = () => {
    return order.orderItems.map((item) => {
      return (
        <tr key={keyMap.get(item)}>
          <td className="text-sm text-left text-darkGray">{item.title}</td>
          <td className="text-sm text-center text-darkGray">{item.quantity}</td>
          <td className="text-sm text-right text-darkGray">
            {displayableMonetaryValue(item.price)}
          </td>
        </tr>
      );
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

  return (
    <div className="px-4">
      <div className="py-5">
        <table className="w-full">
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen w-24 py-2">Date</td>
            <td className="text-sm font-medium text-left text-darkGray py-2">
              {`${displayableDate(order.schedule.orderReadyStart)} @ ${displayableTime(
                order.schedule.orderReadyStart
              )} - ${displayableTime(order.schedule.orderReadyEnd)}`}
            </td>
            <td className="text-sm font-semibold text-right text-darkGreen w-16 px-2 py-2">
              Status
            </td>
            <td className="text-sm font-medium text-right text-darkGray pl-4 py-2 w-1 whitespace-none">
              {
                <CottageTag
                  title={order.orderStatus}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderStatusColor(order.orderStatus)}
                />
              }
            </td>
          </tr>
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen w-24 py-2">Type</td>
            <td className="text-sm font-medium text-left text-darkGray py-2">
              {
                <CottageTag
                  title={order.orderType}
                  tagType={CottageTagType.VIEW}
                  tagColor={getOrderTypeColor(order.orderType)}
                  variant={'outline'}
                />
              }
            </td>
          </tr>
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen py-2">Address</td>
            <td className="text-sm font-medium text-left text-darkGray py-2">
              {constructAddress()}
            </td>
          </tr>
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen pt-2 pb-4">Payment</td>
            <td className="text-sm font-medium text-left text-darkGray pt-2 pb-4">
              {`${order.cardBrand?.toUpperCase() || ''} ending in ${order.cardLastFour || ''}`}
            </td>
          </tr>
          <tr>
            <td colSpan={5} className="border-t"></td>
          </tr>
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen pt-4 pb-2">Notes</td>
            <td className="text-sm font-medium text-left text-darkGray pt-4 pb-2">
              {order.note || '--'}
            </td>
          </tr>
        </table>
      </div>
      <div className="bg-softGreen-20 rounded-lg p-5 mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-medium text-left text-darkGreen">Item Description</th>
              <th className="text-sm font-medium text-center text-darkGreen">Quantity</th>
              <th className="text-sm font-medium text-right text-darkGreen">Price</th>
            </tr>
          </thead>
          <tbody>
            {renderOrderItems()}
            <tr>
              <td colSpan={5} className="border-b pt-5"></td>
            </tr>
            <tr>
              <td colSpan={2} className="text-sm font-medium text-left text-darkGreen pt-5 pb-3.5">
                Subtotal
              </td>
              <td className="text-sm font-medium text-right text-darkGray pt-5 pb-3.5">
                {' '}
                {displayableMonetaryValue(order?.cost?.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                Tax
              </td>
              <td className="text-sm font-medium text-right text-darkGray">
                {displayableMonetaryValue(order?.cost?.estimatedTax)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                Delivery Fee
              </td>
              <td className="text-sm font-medium text-right text-darkGray">
                {displayableMonetaryValue(order.cost?.deliveryFee)}
              </td>
            </tr>
            {order.cost?.couponAmount && (
              <tr>
                <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                  Coupon
                </td>
                <td className="text-sm font-medium text-right text-lightGreen-200">
                  {displayableMonetaryValue(order.cost?.couponAmount)}
                </td>
              </tr>
            )}
            {order.cost?.creditAmount && (
              <tr>
                <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                  Credit
                </td>
                <td className="text-sm font-medium text-right text-lightGreen-200">
                  {displayableMonetaryValue(order.cost?.creditAmount)}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={2} className="text-sm font-medium text-left text-darkGreen pt-6">
                Total Charged
              </td>
              <td className="text-sm font-medium text-right text-darkGray pt-6">
                {displayableMonetaryValue(order.cost?.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {order.refunds?.length > 0 && (
        <div className="mb-6">
          <CottageAlert severity={AlertSeverity.SOFTINFO}>
            <b>Note:</b> This order was fully refunded.
          </CottageAlert>
        </div>
      )}

      <div className="flex items-start gap-6">
        {/** TODO support receipt printing */}
        <Button
          variant="link"
          fontSize="14px"
          fontWeight="400"
          colorScheme="cottage-green"
          className="text-lightGreen-100 underline shadow-none hover:shadow-none"
          onClick={() => {}}>
          Print Receipt
        </Button>
        {order.refunds?.length === 0 && (
          <Button
            variant="link"
            fontSize="14px"
            fontWeight="400"
            colorScheme="cottage-green"
            className="text-lightGreen-100 underline shadow-none hover:shadow-none"
            onClick={onShowRefund}>
            Apply Full Refund
          </Button>
        )}
        {![OrderStatus.CONSUMER_CANCELED, OrderStatus.LOCATION_CANCELED].includes(
          order.orderStatus
        ) && (
          <Button
            variant="link"
            fontSize="14px"
            fontWeight="400"
            colorScheme="cottage-green"
            className="text-lightGreen-100 underline shadow-none hover:shadow-none"
            onClick={onShowMarkCanceled}>
            Mark as Canceled
          </Button>
        )}
      </div>
      <Button
        height="36px"
        className="w-full mt-7 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
        onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export default OrderDetailsModal;
