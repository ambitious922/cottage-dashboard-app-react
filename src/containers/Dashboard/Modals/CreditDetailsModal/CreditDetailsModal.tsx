import { OrderStatus, CreditStatus, MonetaryValue, TransportationType, InvoiceStatus } from 'API';
import { displayableDate, displayableMonetaryValue } from 'utils';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { Box, Button, Text, HStack, Divider } from '@chakra-ui/react';

export interface ICreditDetailsProps {
  createdAt: string | null | undefined;
  consumerFullName: string;
  status: CreditStatus | undefined;
  creditAmount: MonetaryValue | null | undefined;
  creditSnapshot: MonetaryValue | undefined;
  description?: string | null | undefined;
  onClose?: () => void;
}

const CreditDetailsModal: React.FC<ICreditDetailsProps> = ({
  createdAt,
  consumerFullName,
  status,
  creditAmount,
  creditSnapshot,
  description,
  onClose,
}) => {
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
    <Box className="px-4 py-2">
      <Box className="grid grid-flow-col grid-cols-3 grid-rows-1 gap-8">
        <HStack className="col-span-2" spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Customer
          </Text>
          <Text className="text-sm">{consumerFullName}</Text>
        </HStack>
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="80px">
            Status
          </Text>
          <Text className="text-sm">
            {
              <CottageTag
                title={status || ''}
                tagType={CottageTagType.VIEW}
                tagColor={getOrderStatusColor(status)}
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
          <Text className="text-sm">{createdAt && displayableDate(createdAt)}</Text>
        </HStack>
      </Box>
      <Divider />
      <Box className="mt-5">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Credit Given
          </Text>
          <Text className="text-sm">{displayableMonetaryValue(creditAmount)}</Text>
        </HStack>
      </Box>
      <Box className="mt-2">
        <HStack spacing="24px">
          <Text className="text-sm font-medium" width="130px">
            Credit Snapshot
          </Text>
          <Text className="text-sm">{displayableMonetaryValue(creditSnapshot)}</Text>
        </HStack>
      </Box>
      {description ? (
        <Box className="mt-5 px-6 py-4 rounded-lg" style={{ background: '#FCF9E9' }}>
          <Text className="text-sm font-semibold text-darkGray">Notes</Text>
          <Text className="text-sm text-gray-500 mt-2">{description}</Text>
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

export default CreditDetailsModal;
