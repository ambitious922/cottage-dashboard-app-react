export interface CustomerDetailTableHeaderProps {
  totalString: string;
}

const CustomerDetailsTableTransactionsHeader: React.FC<CustomerDetailTableHeaderProps> = ({
  totalString
}) => {

  return (
    <div className="flex items-center justify-between">
      <div className="text-lg font-medium leading-4">
        Total of {totalString} transactions.
      </div>
    </div>
  );
};

export default CustomerDetailsTableTransactionsHeader;

