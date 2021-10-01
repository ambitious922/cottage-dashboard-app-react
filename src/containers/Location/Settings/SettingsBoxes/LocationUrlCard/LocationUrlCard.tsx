import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { PencilIcon } from '@heroicons/react/solid';
import { LocationStatus, UpdateLocationInput } from 'API';
import React, { useContext, useState } from 'react';
import LocationUrlForm from './LocationUrlForm';
import { useUpdateLocation } from 'api/query-hooks/location';
import { Spinner } from 'components/Common/Spinner/Spinner';
import { useParams } from 'react-router';
import { AppContext } from 'App';
import EditFormPopover from 'components/Common/EditFormPopover';
import { Params } from 'constants/Routes';

export interface LocationUrlSectionProps {
  status: LocationStatus;
}

const LocationUrlCard: React.FC<LocationUrlSectionProps> = ({ status }) => {
  const { subdomain, pathSegment } = useParams<Params>();
  const { businessId, locationId } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);

  const updateLocationMutation = useUpdateLocation();

  const onSubmit = async (locationStatus: LocationStatus) => {
    const input: UpdateLocationInput = {
      businessId,
      locationId,
      status: locationStatus,
    };
    try {
      const res = await updateLocationMutation.mutateAsync(input);
      console.log(res);
    } catch (e) {
      // TODO errors
      console.error(e);
    }
  };

  if (updateLocationMutation.isLoading) {
    return <Spinner />;
  }

  if (updateLocationMutation.isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <Stack className="flex flex-row bg-white mb-4 mt-5 p-6 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Location URL
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          Customers use this link to place orders.
        </Text>
      </Box>
      <Box style={{ width: '75%' }} className="pl-6 m-0">
        {/* TODO Link icon */}
        <Text>{`https://${subdomain}.mycottage.menu/${pathSegment}`}</Text>
      </Box>
    </Stack>
  );
};

export default LocationUrlCard;
