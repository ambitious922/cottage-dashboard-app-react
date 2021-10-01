import { Box, Stack, Badge, Button, Checkbox, Text, HStack } from '@chakra-ui/react';

export interface OrdersTableHeaderProps {
  totalOrders: number;
}

const OverviewOrdersTableHeader: React.FC<OrdersTableHeaderProps> = ({ totalOrders }) => {
  return (
    <HStack className="gap-4 justify-between items-center py-5">
      <HStack>
      <Text className="text-base font-medium">
        Showing {`${totalOrders}`} {totalOrders !== 1 ? 'orders' : 'order'} to be fulfilled
      </Text>
      <Box>{/* TODO: date range picker compoment */}</Box>
      <Button
        className="text-sm font-medium rounded-md bg-softGreen text-lightGreen-100 px-2 py-2"
        style={{ minWidth: '122px', height: '33px' }}>
        + Search filters
      </Button>
      </HStack>
      <Checkbox colorScheme="cottage-green"><Text fontSize="12px" fontWeight="400">Show completed and cancelled orders</Text></Checkbox>
    </HStack>
  );
};

export default OverviewOrdersTableHeader;
