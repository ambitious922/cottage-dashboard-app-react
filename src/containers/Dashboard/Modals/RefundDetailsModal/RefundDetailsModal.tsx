import { useContext, useState } from 'react';
import { Box, Text, HStack, Divider, Button } from '@chakra-ui/react';
import { GetRefundInput, OrderStatus, CreditStatus, InvoiceStatus } from 'API';
import { AppContext } from 'App';
import { displayableDate, displayableMonetaryValue } from 'utils';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { useGetRefund } from 'api/query-hooks/refund';
import { Spinner } from 'components/Common/Spinner';

export interface IRefundDetailsProps {
  refundId: string | undefined;
  consumerFullName: string;
  onClose?: () => void;
}

const RefundDetailsModal: React.FC<IRefundDetailsProps> = ({
  refundId,
  consumerFullName,
  onClose,
}) => {
  const { businessId } = useContext(AppContext);
  const [keyMap] = useState(new Map());

  if (!refundId) {
    return <div></div>;
  }

  const getRefundInput: GetRefundInput = {
    refundId,
    businessId,
  };

  const { data, isLoading, isError } = useGetRefund(getRefundInput);
  const refund = data?.data?.refund;

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  if (isError || !refund) {
    console.warn(isError);
    return (
      <Box>
        <div className="text-center text-sm text-darkGray">Something went wrong</div>
      </Box>
    );
  }

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
    <Box>
      <Box className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-8">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Customer
          </Text>
          <Text className="text-sm">{consumerFullName}</Text>
        </HStack>
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Status
          </Text>
          <Text className="text-sm">
            {
              <CottageTag
                title={refund.refundStatus}
                tagType={CottageTagType.VIEW}
                tagColor={getOrderStatusColor(refund.refundStatus)}
              />
            }
          </Text>
        </HStack>
      </Box>
      <Box className="mt-2 mb-6">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Date
          </Text>
          <Text className="text-sm">{displayableDate(refund.createdAt)}</Text>
        </HStack>
      </Box>
      <Divider />
      <Box className="mt-5">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            {refund.order?.id ? 'Order Number' : 'Invoice Number'}
          </Text>
          <Text className="text-sm">
            {refund.order?.id ? refund.order?.number : refund.subscriptionInvoice?.number}
          </Text>
        </HStack>
      </Box>
      <Box className="mt-2">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            {refund.order?.id ? 'Order Amount' : 'Invoice Amount'}
          </Text>
          <Text className="text-sm">
            {refund.order?.id ? (
              <>{displayableMonetaryValue(refund.order?.cost?.total)}</>
            ) : (
              <>{displayableMonetaryValue(refund.subscriptionInvoice?.cost?.total)}</>
            )}
          </Text>
        </HStack>
      </Box>
      <Box className="mt-2">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Type
          </Text>
          <Text className="text-sm">{refund.order?.id ? 'Order' : 'Susbcription Invoice'}</Text>
        </HStack>
      </Box>
      <Box className="mt-5">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Refund Amount
          </Text>
          <Text className="text-sm">{displayableMonetaryValue(refund.cost?.paymentTotal)}</Text>
        </HStack>
      </Box>
      {refund.description ? (
        <Box className="mt-5 px-6 py-4 rounded-lg" style={{ background: '#FCF9E9' }}>
          <Text className="text-sm font-semibold text-darkGray">Notes</Text>
          <Text className="text-sm text-gray-500 mt-2">{refund.description}</Text>
        </Box>
      ) : null}
      <Button
        height="36px"
        className="w-full mt-6 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
        onClick={onClose}>
        Close
      </Button>
    </Box>
  );
};

export default RefundDetailsModal;
