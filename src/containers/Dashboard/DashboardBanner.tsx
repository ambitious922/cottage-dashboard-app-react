import { Button, Box, Text, HStack } from '@chakra-ui/react';
import { Params } from 'constants/Routes';
import { useParams, useHistory } from 'react-router';
import { ExclamationIcon as ExclamationIconOutline } from '@heroicons/react/outline';

interface IDashboardBannerProps {}

const DashboardBanner: React.FC<IDashboardBannerProps> = () => {
  const history = useHistory();
  const { subdomain } = useParams<Params>();

  const pushToSettings = () =>
    history.push(`/business/${subdomain}/settings`, { fromBanner: true });

  return (
    <HStack
      className="px-8 py-4 w-full font-sans items-center justify-between z-50"
      style={{ background: '#102D29' }}>
      <HStack spacing={6}>
        <ExclamationIconOutline className="w-9 h-9 text-white" aria-hidden="true" />
        <Box>
          <Text fontSize="28px" fontWeight="600" lineHeight="30px" className="text-white">
            Finish setting up your account.
          </Text>
          <Text className="text-sm font-semibold text-white">
            You will need to verify your bank details to start taking orders.
          </Text>
        </Box>
      </HStack>
      <Button
        fontSize="14px"
        fontWeight="600"
        colorScheme="cottage-green"
        className="focus:outline-none focus:shadow-none"
        onClick={pushToSettings}>
        Go to Payment Settings
      </Button>
    </HStack>
  );
};

export default DashboardBanner;
