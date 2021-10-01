import React, { useState } from 'react';
import { Stack, Box, Button, Text } from '@chakra-ui/react';
import { PencilIcon } from '@heroicons/react/solid';
import LocationDetailsForm from './LocationDetailsForm';
import EditFormPopover from 'components/Common/EditFormPopover';
import { LocationStatus } from 'API';
import { useParams } from 'react-router';
import { Params } from 'constants/Routes';
import { toCamelCase } from 'utils';

export interface LocationUrlSectionProps {
  title: string;
  description: string | null | undefined;
  status: LocationStatus;
}

const LocationDetailsCard: React.FC<LocationUrlSectionProps> = ({ title, description, status }) => {
  const { subdomain, pathSegment } = useParams<Params>();
  const [showModal, setShowModal] = useState(false);

  return (
    <Stack className="flex flex-row bg-white my-4 p-6 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Location Details
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          This information is shown on your Cottage website's shop page.
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
      <Box style={{ width: '75%' }} className="pl-6 m-0">
        <Box className="grid grid-flow-col grid-cols-1 grid-rows-4 gap-6">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Shop Name
            </Text>
            <Text className="text-sm px-2 mt-3 font-semibold">{title}</Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Shop Description
            </Text>
            {description ? (
              <Text className="text-sm px-2 mt-3">{description}</Text>
            ) : (
              <Text className="text-sm text-grey px-2 mt-3">No description</Text>
            )}
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Location URL
            </Text>
            {/* TODO Link icon */}
            <Text className="text-sm px-2 mt-3">{`https://${subdomain}.mycottage.menu/${pathSegment}`}</Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Location Status
            </Text>
            <Text className="text-sm px-2 mt-3">{toCamelCase(status)}</Text>
          </Box>
        </Box>
      </Box>
      <EditFormPopover
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Location Details">
        <LocationDetailsForm
          shopName={title || ''}
          shopDescription={description || ''}
          onClose={() => setShowModal(false)}
        />
      </EditFormPopover>
    </Stack>
  );
};

export default LocationDetailsCard;
