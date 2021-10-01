import { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@chakra-ui/react';
import {
  GetOrderInput,
  OrderStatus,
  TransitionOrderLocationCanceledInput,
  TransportationType,
} from 'API';
import { useGetOrder, useTransitionOrderLocationCanceled } from 'api/query-hooks/order';
import { AppContext } from 'App';
import { displayableDate, displayableTime, displayableMonetaryValue } from 'utils/index';
import { Spinner } from 'components/Common/Spinner';
import { OrderErrors } from 'models/error';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';

export interface IOrderRowProps {
  orderId: string;
  locationId: string;
  cancelMessage: string;
  orderStatus: OrderStatus;
  onNewStatus: (status: OrderStatus) => void;
}

const OrderRowDetails: React.FC<IOrderRowProps> = ({
  orderId,
  locationId,
  cancelMessage,
  orderStatus,
  onNewStatus,
}) => {
  const { businessId } = useContext(AppContext);
  const [keyMap] = useState(new Map());
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [orderStatusState, setOrderStatusState] = useState<OrderStatus>(orderStatus);
  const [errorMessage, setErrorMessage] = useState('');
  const transitionOrderCanceledMutation = useTransitionOrderLocationCanceled();

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
      <tr className="border-none">
        <td colSpan={8}>
          <Spinner />
        </td>
      </tr>
    );
  }

  if (isError || !order) {
    return (
      <tr className="border-none">
        <td colSpan={8}>
          <div>Something went wrong</div>
        </td>
      </tr>
    );
  }

  const onCancelClick = () => {
    setErrorMessage('');
    setConfirmCancelModal(false);
  };

  const onCancelOrder = async () => {
    setErrorMessage('');

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
      const updatedOrderStatus =
        data?.transitionOrderLocationCanceled?.order?.orderStatus || orderStatus;
      onNewStatus(updatedOrderStatus);
      setOrderStatusState(updatedOrderStatus);
      setConfirmCancelModal(false);
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
          <td className="text-sm font-medium text-left text-darkGray">{item.title}</td>
          <td className="text-sm font-medium text-center text-darkGray">{item.quantity}</td>
          <td className="text-sm font-medium text-right text-darkGray">
            {displayableMonetaryValue(item.price)}
          </td>
        </tr>
      );
    });
  };

  const estTaxAmount = order.cost?.estimatedTax?.amount || 0;
  const deliveryFeeAmount = order.cost?.deliveryFee?.amount || 0;
  const couponAmount = order.cost?.couponAmount?.amount || 0;
  const creditAmount = order.cost?.creditAmount?.amount || 0;
  const totalAmount = order.cost?.total?.amount || 0;
  return (
    <tr className="border-none">
      <td colSpan={8} className="px-2 py-0 text-xs whitespace-nowrap">
        <div className="flex justify-between">
          <div className="py-5">
            <table>
              <tr>
                <td className="text-sm font-semibold text-left text-darkGreen w-32 pb-6">
                  {order.orderType === TransportationType.DELIVERY
                    ? 'Delivery Time'
                    : 'Pickup Time'}
                </td>
                <td className="text-sm font-medium text-left text-darkGray pb-6">
                  {`${displayableDate(order.schedule.orderReadyStart)} | ${displayableTime(
                    order.schedule.orderReadyStart
                  )} - ${displayableTime(order.schedule.orderReadyEnd)}`}
                </td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-left text-darkGreen pb-6">Address</td>
                <td className="text-sm font-medium text-left text-darkGray pb-6">
                  {constructAddress()}
                </td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-left text-darkGreen pb-6">Payment</td>
                <td className="text-sm font-medium text-left text-darkGray pb-6">
                  {`${order.cardBrand?.toUpperCase() || ''} ending in ${order.cardLastFour || ''}`}
                </td>
              </tr>
              <tr>
                <td className="text-sm font-semibold text-left text-darkGreen pb-6">Notes</td>
                <td className="text-sm font-medium text-left text-darkGray pb-6">{order.note}</td>
              </tr>
            </table>
          </div>
          <div className="bg-softGreen-20 rounded-lg p-5 w-2/5 mb-6">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-sm font-normal text-left text-darkGreen">Item Description</th>
                  <th className="text-sm font-normal text-center text-darkGreen">Quantity</th>
                  <th className="text-sm font-normal text-right text-darkGreen">Price</th>
                </tr>
              </thead>
              <tbody>
                {renderOrderItems()}
                <tr>
                  <td
                    colSpan={2}
                    className="text-sm font-normal text-left text-darkGreen pt-5 pb-3.5">
                    Subtotal
                  </td>
                  <td className="text-sm font-medium text-right text-darkGray pt-5 pb-3.5"></td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                    Tax
                  </td>
                  <td className="text-sm font-medium text-right text-darkGray">
                    {displayableMonetaryValue(order.cost?.estimatedTax)}
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
                <tr>
                  <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                    Coupon
                  </td>
                  <td className="text-sm font-medium text-right text-lightGreen-200">
                    {displayableMonetaryValue(order.cost?.couponAmount)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-sm font-medium text-left text-darkGray">
                    Credit
                  </td>
                  <td className="text-sm font-medium text-right text-lightGreen-200">
                    {displayableMonetaryValue(order.cost?.creditAmount)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-sm font-normal text-left text-darkGreen pt-6">
                    Total Charged
                  </td>
                  <td className="text-sm font-medium text-right text-darkGray pt-6">
                    {displayableMonetaryValue(order.cost?.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-start py-5" style={{ width: '200px' }}>
            {/** TODO support receipt printing */}
            <Button
              variant="link"
              fontSize="14px"
              fontWeight="400"
              colorScheme="cottage-green"
              className="text-lightGreen-100 focus:shadow-none"
              onClick={() => {}}>
              Print Receipt
            </Button>
            {orderStatusState === OrderStatus.PURCHASED && (
              <Button
                variant="link"
                fontSize="14px"
                fontWeight="400"
                colorScheme="cottage-green"
                className="text-lightGreen-100 mt-4 focus:shadow-none"
                onClick={() => setConfirmCancelModal(true)}>
                Mark Canceled
              </Button>
            )}
          </div>
        </div>
        {confirmCancelModal && (
          <CottageConfirmationModal
            title={`Cancel Order: ${order.number}`}
            message={cancelMessage}
            confirmButtonText={'Mark as canceled'}
            onConfirm={onCancelOrder}
            onCancel={onCancelClick}
            isLoading={transitionOrderCanceledMutation.isLoading}
            errorMessage={errorMessage}
          />
        )}
      </td>
    </tr>
  );
};

export default OrderRowDetails;
