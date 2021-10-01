import { Button, Badge, Stack } from "@chakra-ui/react";
import { PencilIcon } from '@heroicons/react/outline';

export interface PlanDetailTableHeaderProps {
  totalString: string;
  activeTab: string;
  isDisabled?: boolean;
  onClickHandle?: any;
}

const PlanDetailTableHeader: React.FC<PlanDetailTableHeaderProps> = ({
  totalString,
  activeTab,
  isDisabled,
  onClickHandle
}) => {
  if(activeTab=="locations"){
    return (
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-4">
          Available at {totalString} {activeTab.toLowerCase()}
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
    <Stack direction="row">
      <Badge textTransform="none" className="text-sm font-medium rounded-md bg-softGreen text-lightGreen-100 px-2 py-1">Active <span className="opacity-50">{totalString}</span></Badge>
      <Badge textTransform="none" colorScheme="white" className="text-sm font-medium rounded-md text-lightGreen-100 px-2 py-1">Paused <span className="opacity-50">0</span></Badge>
      <Badge textTransform="none" colorScheme="white" className="text-sm font-medium rounded-md text-lightGreen-100 px-2 py-1">Cancelled <span className="opacity-50">0</span></Badge>
    </Stack>
  );
};

export default PlanDetailTableHeader;

