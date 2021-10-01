import { Stack, Badge, Button } from '@chakra-ui/react';

export interface OrdersTableHeaderProps {
  totalOrders: number;
}

const OrdersTableHeader: React.FC<OrdersTableHeaderProps> = ({ totalOrders }) => {
  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {`${totalOrders}`} order(s) between
      </div>
      <div>
        {/* TODO: date range picker compoment */}
      </div>
      <Button
        className="text-sm font-medium rounded-md bg-softGreen text-lightGreen-100 px-2 py-2"
        style={{ minWidth: '122px', height: '33px' }}
      >
        + Search filters
      </Button>
    </div>
  );
};

export default OrdersTableHeader;
