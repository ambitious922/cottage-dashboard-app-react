import React, { useState } from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/react';
import { PencilIcon } from '@heroicons/react/outline';
import BusinessDetailsForm from './BusinessDetailsForm';
import EditFormPopover from '../../../../../components/Common/EditFormPopover/EditFormPopover';
import { BusinessStatus } from 'API';
import { displayPhoneNumber } from 'utils';
import CottageTooltip from 'components/Common/CottageTooltip';

export interface BusinessDetailsBoxProps {
  businessName: string;
  businessUrl: string;
  status: BusinessStatus;
  email: string;
  phoneNumber: string;
}

const BusinessDetailsCard: React.FC<BusinessDetailsBoxProps> = ({
  businessName,
  businessUrl,
  status,
  email,
  phoneNumber,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Stack direction="row" className="bg-white my-4 p-6 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Business Details
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          Basic account information used for verification. Phone number and email are not shared
          with your customers. To deactivate your account, please reach out.
        </Text>
        <Button
          className="text-sm bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
          fontSize="14px"
          fontWeight="600"
          size="md"
          onClick={() => setShowModal(true)}>
          <PencilIcon className="h-4 w-4 mr-3" /> Edit
        </Button>
      </Box>
      <Box className="pl-4" style={{ width: '75%' }}>
        <Text fontSize="14px" fontWeight="500" className="px-2">
          Business Name
        </Text>
        <Text className="text-sm font-semibold px-2 mt-3">{businessName}</Text>
        <Text fontSize="14px" fontWeight="500" className="flex items-center gap-1 px-2 mt-6">
          Business Url&nbsp;
          <CottageTooltip text="Your free cottage domain. We can mask this with your personal website later just reach out to us." />
        </Text>
        <Text className="text-lg px-2 mt-3 text-grey">{businessUrl}</Text>
        <Box className="flex gap-0 mt-6">
          <Text fontSize="14px" fontWeight="500" className="px-2">
            Business Status
          </Text>
          <Text className="text-sm font-medium italic text-lightGreen-100 px-2">{status}</Text>
        </Box>
        <Box className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-6 mt-6">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Phone Number
            </Text>
            <Text className="text-sm px-2 mt-3">{displayPhoneNumber(phoneNumber)}</Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Email
            </Text>
            {email ? (
              <Text className="text-sm px-2 mt-3">{email}</Text>
            ) : (
              <Text className="text-sm text-grey px-2 mt-3">Not entered</Text>
            )}
          </Box>
        </Box>
      </Box>
      <EditFormPopover
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Business Details">
        {
          <BusinessDetailsForm
            onClose={() => setShowModal(false)}
            businessName={businessName}
            businessUrl={businessUrl}
            email={email}
            phoneNumber={phoneNumber}
            status={status}
          />
        }
      </EditFormPopover>
    </Stack>
  );
};

export default BusinessDetailsCard;
