import React, { useContext, useEffect } from 'react';
import { AppContext } from 'App';
import { Stack, Box, Text, Button, HStack, useToast } from '@chakra-ui/react';
import { useCreateStripeAccountLink } from 'api/query-hooks/accountLink';
import { BusinessStatus } from 'API';
import { useParams } from 'react-router';
import { Params } from 'constants/Routes';
import { errorToast } from 'components/Common/Toast';

export interface StriprVerificationBoxProps {
  businessStatus: BusinessStatus;
}

const VerificationCard: React.FC<StriprVerificationBoxProps> = ({ businessStatus }) => {
  const createStripeAccountLink = useCreateStripeAccountLink({ retry: 3 });
  const toast = useToast();
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();

  useEffect(() => {
    if (businessStatus !== BusinessStatus.ACTIVE) {
      createStripeAccountLink.mutateAsync({
        businessId,
        failureUrl: `${window.location.origin}/business/${subdomain}/settings`,
        successUrl: `${window.location.origin}/business/${subdomain}/settings`,
      });
    }
  }, []);

  const onVerifyClick = () => {
    const accountLinkUrl = createStripeAccountLink.data?.data?.createAccountLink?.accountLink?.url;
    if (!accountLinkUrl) {
      errorToast(toast, 'Something went wrong, refresh the page and click verify again.');
      return;
    }

    window.open(accountLinkUrl, '_blank');
  };

  return (
    <Stack direction="row" className="items-center bg-white my-4 p-6 gap-4 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Payment Processing
        </Text>
      </Box>
      <Box style={{ width: '75%' }}>
        {businessStatus === BusinessStatus.ACTIVE ? (
          <HStack className="ml-2">
            <Box className="border-2 border-indigo-400 rounded-lg px-4" padding={2}>
              <Text className="text-indigo-400 font-medium text-xl whitespace-nowrap">
                Powered by <span className="font-extrabold">Stripe</span>
              </Text>
            </Box>
            <Box paddingX={2}>
              <Stack>
                <Text fontSize="16px" className="font-semibold">
                  Your business can now begin accepting customer payments.
                </Text>
                {/* <Link to="#" className="m-0 text-sm text-lightGreen-100 underline">
                  Update business settings
                </Link> */}
              </Stack>
            </Box>
          </HStack>
        ) : (
          <>
            <Stack className="ml-2 bg-lightGreen rounded-t-lg" padding={6}>
              <HStack>
                <Box className="border-2 border-white rounded-lg px-4" padding={2}>
                  <Text className="font-medium text-xl text-white whitespace-nowrap">
                    Powered by <span className="font-extrabold">Stripe</span>
                  </Text>
                </Box>
                <Box className="p-2">
                  <Text className="text-sm font-semibold text-white">
                    *Verifying with Stripe is required to enable ordering.
                  </Text>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <Text className="text-base font-normal text-white mt-4">
                    Why do we use Stripe? Because they provide the most secure and reliable online
                    payment processing on the market. It’s painless to verify your account and 100%
                    guaranteed to keep every transaction safe.
                  </Text>
                </Box>
              </HStack>
            </Stack>
            <Stack className="ml-2 rounded-b-lg" padding={3} style={{ backgroundColor: '#102D29' }}>
              <HStack className="flex justify-between items-center">
                <Box className="p-3">
                  <Text className="text-sm font-medium text-white">
                    <span className="text-sm font-semibold">Please note:</span> This process can
                    take up to 24 hours once you've provided all your information to Stripe. Keep an
                    eye out for a confirmation email from us. In the meantime, explore the dashboard
                    and begin creating products.
                  </Text>
                </Box>
                <Box className="p-3">
                  <Button
                    className="bg-lightGreen hover:bg-lightGreen-100 text-sm font-semibold text-white focus:outline-none focus:shadow-none"
                    isLoading={createStripeAccountLink.isLoading}
                    onClick={onVerifyClick}>
                    Verify with Stripe
                  </Button>
                </Box>
              </HStack>
            </Stack>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default VerificationCard;
