import React, { useState } from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/react';
import { PencilIcon, PlusIcon } from '@heroicons/react/outline';
import { BusinessType } from 'API';
import EditFormPopover from 'components/Common/EditFormPopover';
import BankAccountForm from './BankAccountForm';

export interface IBankAccountCardProps {
  businessType: BusinessType;
  accountHolderName: string | undefined;
  lastFour: string | undefined;
  routingNumber: string | undefined;
}

const BankAccountCard: React.FC<IBankAccountCardProps> = ({
  businessType,
  accountHolderName,
  lastFour,
  routingNumber,
}) => {
  const [showModal, setShowModal] = useState(false);
  const showBlankView = !lastFour && !routingNumber;

  return (
    <Stack direction="row" className="bg-white my-4 p-6 gap-4 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Bank Account Details
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          Provide your bank account details so we can securely direct deposit your earnings.
        </Text>
        {!showBlankView && (
          <Button
            className="text-sm bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
            fontSize="14px"
            fontWeight="600"
            size="md"
            onClick={() => setShowModal(true)}>
            <PencilIcon className="h-4 w-4 mr-3" /> Edit
          </Button>
        )}
      </Box>
      <Box style={{ width: '75%' }}>
        {showBlankView ? (
          <Box className="flex items-center justify-center h-full">
            {/* <Text className="text-sm text-gray-400 mx-2">
              Securely provide your bank account details for direct deposit.
            </Text> */}
            <Button
              className="text-sm bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
              fontSize="14px"
              fontWeight="600"
              size="md"
              onClick={() => setShowModal(true)}>
              <PlusIcon className="h-4 w-4 mr-3" /> Connect my account
            </Button>
          </Box>
        ) : (
          <Box style={{ width: '75%' }}>
            <Text className="text-sm font-medium px-2">Account Holder Name</Text>
            <Text className="text-sm px-2 mt-3">{accountHolderName || ''}</Text>
            <Box className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-4 mt-8">
              <Box>
                <Text className="text-sm font-medium px-2">Routing Number</Text>
                <Text className="text-sm px-2 mt-3">{routingNumber}</Text>
              </Box>
              <Box>
                <Text className="text-sm font-medium px-2">Account Number</Text>
                <Text className="text-sm px-2 mt-3">{`Ending in ${lastFour}`}</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <EditFormPopover
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={showBlankView ? 'Connect Your Bank Account' : 'Change Your Bank Account'}>
        {<BankAccountForm onClose={() => setShowModal(false)} businessType={businessType} />}
      </EditFormPopover>
    </Stack>
  );
};

export default BankAccountCard;
