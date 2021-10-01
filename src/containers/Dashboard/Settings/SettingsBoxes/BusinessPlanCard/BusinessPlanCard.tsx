import React, { useContext, useState } from 'react';
import { Stack, Box, Text, Button, HStack, Divider, Heading } from '@chakra-ui/react';
import { UploadIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { AppContext } from 'App';
import { BusinessLevelType } from 'API';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { useUpdateBusiness } from 'api/query-hooks/business';
import { BusinessErrors } from 'models/error';

export interface IBusinessPlanCardProps {
  level: BusinessLevelType;
}

const BusinessPlanCard: React.FC<IBusinessPlanCardProps> = ({ level }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { businessId, producerId } = useContext(AppContext);

  const updateBusinessMutation = useUpdateBusiness();

  const onCancelClick = () => {
    setShowUpgradeModal(false);
    setErrorMessage('');
  };

  const onConfirmUpgrade = async () => {
    try {
      await updateBusinessMutation.mutateAsync({
        businessId,
        producerId,
        level: BusinessLevelType.PREMIUM,
      });
      setShowUpgradeModal(false);
    } catch (e) {
      // TODO error handling
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case BusinessErrors.BusinessLevelDowngradeErrorCode:
          message = `Downgrading from premium to standard requires reaching out to us so we can review your account.`;
          break;
        case BusinessErrors.BusinessNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      setErrorMessage(message);
    }
  };

  const isStandardPlan = level === BusinessLevelType.STANDARD;
  const isPremiumPlan = level === BusinessLevelType.PREMIUM;

  return (
    <Stack direction="row" className="bg-white my-4 p-6 rounded-lg">
      {showUpgradeModal ? (
        <CottageConfirmationModal
          title="Upgrade to Cottage Premium"
          message="Upgrading to premium will increase resource limits from products, plans, coupons, daily schedule limits, and schedules. If you need to downgrade in the future, you'll need to reach out to customer support."
          onCancel={onCancelClick}
          onConfirm={onConfirmUpgrade}
          isLoading={updateBusinessMutation.isLoading}
          errorMessage={errorMessage}
          confirmButtonText="Yes, upgrade to Cottage Premium"
          cancelButtonText="Cancel"
        />
      ) : null}
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Your Cottage Plan
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          {isStandardPlan
            ? 'For Cottage Standard users, you can easily upgrade to Cottage Premium at any point.'
            : 'If you want to downgrade, please reach out to us so we can get you back to Cottage Standard.'}
        </Text>
        {isStandardPlan && (
          <>
            <Button
              className="text-sm bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
              fontSize="14px"
              fontWeight="600"
              size="md"
              onClick={() => setShowUpgradeModal(true)}>
              <UploadIcon className="h-5 w-5 mx-3" /> Upgrade to Premium
            </Button>
          </>
        )}
      </Box>
      <Box className="pl-6" style={{ width: '75%' }}>
        <HStack className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-6">
          <Box
            className="border-outline rounded-lg h-full"
            style={
              isStandardPlan
                ? { borderWidth: '3px', borderColor: '#294C3B' }
                : { borderWidth: '3px', borderColor: '#E3EDE9' }
            }>
            <HStack
              className="flex justify-center items-center px-4 rounded-t-md"
              style={
                isStandardPlan
                  ? { backgroundColor: '#294C3B', paddingTop: '2rem', paddingBottom: '2rem' }
                  : { backgroundColor: 'white', paddingTop: '2.25rem', paddingBottom: '2.25rem' }
              }>
              {isStandardPlan && <CheckCircleIcon className="h-10 w-10 mr-1" color="white" />}
              <Text
                fontSize="21px"
                fontWeight="600"
                style={isStandardPlan ? { color: 'white' } : { color: '#294C3B' }}>
                Cottage Standard
              </Text>
            </HStack>
            <Stack
              style={
                isStandardPlan
                  ? { paddingLeft: '0px', paddingRight: '0px' }
                  : { paddingLeft: '24px', paddingRight: '24px' }
              }>
              <Divider
                opacity="1"
                borderBottomWidth="3px"
                style={isStandardPlan ? { borderColor: '#294C3B' } : { borderColor: '#E3EDE9' }}
              />
            </Stack>
            <Stack className="p-6">
              <Heading
                fontSize="20px"
                fontWeight="500"
                className="text-center font-sans font-medium text-mediumGreen">
                <span style={{ fontSize: '28px' }}>3%</span> Per Transaction
              </Heading>
              <Text className="text-sm font-medium text-center text-mediumGreen">
                + 2.9%+30¢ Stripe™ Payment Fee
              </Text>
              <Text className="mt-8 mb-2 text-base font-semibold text-center">What You Get: </Text>
              <Text className="my-2 text-sm font-medium text-center">Up to two locations</Text>
              <Text className="my-2 text-sm font-medium text-center">
                Up to five active coupons
              </Text>
              <Text className="my-2 text-sm font-medium text-center">50 Menu Items</Text>
              <Text className="my-2 text-sm font-medium text-center">3 meal plans</Text>
              <Text className="my-2 text-sm font-medium text-center">One daily schedule</Text>
            </Stack>
          </Box>
          <Box
            className="border-outline rounded-lg h-full"
            style={
              isPremiumPlan
                ? { borderWidth: '3px', borderColor: '#294C3B' }
                : { borderWidth: '3px', borderColor: '#E3EDE9' }
            }>
            <HStack
              className="flex justify-center items-center px-4 rounded-t-md"
              style={
                isPremiumPlan
                  ? { backgroundColor: '#294C3B', paddingTop: '2rem', paddingBottom: '2rem' }
                  : { backgroundColor: 'white', paddingTop: '2.25rem', paddingBottom: '2.25rem' }
              }>
              {isPremiumPlan && <CheckCircleIcon className="h-10 w-10 mr-1" color="white" />}
              <Text
                fontSize="21px"
                fontWeight="600"
                style={isPremiumPlan ? { color: 'white' } : { color: '#294C3B' }}>
                Cottage Premium
              </Text>
            </HStack>
            <Stack
              style={
                isPremiumPlan
                  ? { paddingLeft: '0px', paddingRight: '0px' }
                  : { paddingLeft: '24px', paddingRight: '24px' }
              }>
              <Divider
                opacity="1"
                borderBottomWidth="3px"
                style={isPremiumPlan ? { borderColor: '#294C3B' } : { borderColor: '#E3EDE9' }}
              />
            </Stack>
            <Stack className="p-6">
              <Heading
                fontSize="20px"
                fontWeight="500"
                className="text-center font-sans font-medium text-mediumGreen">
                <span style={{ fontSize: '28px' }}>5%</span> Per Transaction
              </Heading>
              <Text className="text-sm font-medium text-center text-mediumGreen">
                + 2.9%+30¢ Stripe™ Payment Fee
              </Text>
              <Text className="mt-8 mb-2 text-base font-semibold text-center">What You Get: </Text>
              <Text className="my-2 text-sm font-medium text-center">Up to ten locations</Text>
              <Text className="my-2 text-sm font-medium text-center">unlimited active coupons</Text>
              <Text className="my-2 text-sm font-medium text-center">unlimited menu items</Text>
              <Text className="my-2 text-sm font-medium text-center">unlimited meal plans</Text>
              <Text className="my-2 text-sm font-medium text-center">multiple daily schedules</Text>
              <Text className="my-2 text-sm font-medium text-center">self hosted store access</Text>
            </Stack>
          </Box>
        </HStack>
      </Box>
    </Stack>
  );
};

export default BusinessPlanCard;
