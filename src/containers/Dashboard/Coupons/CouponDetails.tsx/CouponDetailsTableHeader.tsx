import { Button } from "@chakra-ui/react";
import { PencilIcon } from '@heroicons/react/outline';

export interface CouponDetailTableHeaderProps {
  totalOrdersString: string;
  activeTab: string;
  isDisabled?: boolean;
  onClickHandle?: any;
}

const CouponDetailTableHeader: React.FC<CouponDetailTableHeaderProps> = ({
  totalOrdersString,
  activeTab,
  isDisabled,
  onClickHandle
}) => {
  if(activeTab=="locations"){
    return (
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-4">
          Available at {totalOrdersString} {activeTab.toLowerCase()}
        </div>
        <Button
          width="95px" height="40px"
          className="text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
          isDisabled={isDisabled}
          onClick={() => onClickHandle()}
          leftIcon={<PencilIcon className="w-4 h-4"/>}
        >
          Edit
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="text-lg font-medium leading-4">
        Total of {totalOrdersString} {activeTab.toLowerCase()}
      </div>
    </div>
  );
};

export default CouponDetailTableHeader;

