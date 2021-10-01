import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { PencilIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import EditFormPopover from 'components/Common/EditFormPopover';
import { displayPhoneNumber } from 'utils';
import LocationSupportOptionsForm from './LocationSupportOptionsForm';

export interface LocationSupportOptionsCardProps {
  supportPhone: string | null | undefined;
  supportEmail: string | null | undefined;
}

const LocationSupportOptionsCard: React.FC<LocationSupportOptionsCardProps> = ({
  supportPhone,
  supportEmail,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Stack className="flex flex-row bg-white my-4 p-6 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Support Options
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          These will be visible to all of your shop customers.
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
      <Box className="pl-4 m-0" style={{ width: '75%' }}>
        <Box className="grid grid-flow-col grid-cols-1 grid-rows-2 gap-6">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Phone Number
            </Text>
            {supportPhone ? (
              <Text className="text-sm px-2 mt-3">{displayPhoneNumber(supportPhone)}</Text>
            ) : (
              <Text className="text-sm text-grey px-2 mt-3">No support number provided</Text>
            )}
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Email
            </Text>
            {supportEmail ? (
              <Text className="text-sm px-2 mt-3">{supportEmail}</Text>
            ) : (
              <Text className="text-sm text-grey px-2 mt-3">No support email provided</Text>
            )}
          </Box>
        </Box>
      </Box>
      <EditFormPopover
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Support Options">
        {
          <LocationSupportOptionsForm
            onClose={() => setShowModal(false)}
            supportEmail={supportEmail || ''}
            supportPhoneNumber={supportPhone || ''}
          />
        }
      </EditFormPopover>
    </Stack>
  );
};

export default LocationSupportOptionsCard;
