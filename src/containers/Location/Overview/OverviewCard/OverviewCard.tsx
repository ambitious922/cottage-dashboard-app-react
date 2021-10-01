import OverviewFulfillment from '../OverviewFulfillment';
import OverviewCalendar from '../OverviewCalendar';
import { Box, HStack } from '@chakra-ui/react';

const OverviewCard: React.FC = () => {
  return (
    <Box className="font-sans text-darkGreen px-8 py-6 mt-5 bg-white rounded-lg shadow">
      <Box className="grid grid-cols-3 gap-10">
          <Box>
            <OverviewCalendar />
          </Box>
          <Box className="col-span-2">
            <OverviewFulfillment /> 
          </Box>
      </Box>
    </Box>
  );
};

export default OverviewCard;
