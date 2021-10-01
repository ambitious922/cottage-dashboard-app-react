import React, { useState } from 'react';
import { Stack, Box, Text, Button } from '@chakra-ui/react';
import { PencilIcon } from '@heroicons/react/outline';
import BusinessAddressForm from './BusinessAddressForm';
import { StateOrProvince, CountryCode } from 'API';
import EditFormPopover from 'components/Common/EditFormPopover';

export interface IBusinessAddressBoxProps {
  street: string;
  street2: string;
  city: string;
  postalCode: string;
  stateOrProvince: StateOrProvince;
  country: CountryCode;
}

const BusinessAddressCard: React.FC<IBusinessAddressBoxProps> = ({
  street,
  street2,
  city,
  postalCode,
  stateOrProvince,
  country,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Stack direction="row" className="bg-white my-4 p-6 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Primary Business Address
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          This will be used as your default business address. All of these fields are mandatory to
          allow payment processing. We won't share this with your customers.
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
        <Box className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-6">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Street
            </Text>
            <Text className="text-sm px-2 mt-3">{street}</Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Apt/Suite
            </Text>
            <Text className="text-sm px-2 mt-3">{street2}</Text>
          </Box>
        </Box>
        <Box className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-6 mt-6">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              City
            </Text>
            <Text className="text-sm px-2 mt-3">{city}</Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Zip Code
            </Text>
            <Text className="text-sm px-2 mt-3">{postalCode}</Text>
          </Box>
        </Box>
        <Box className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-6 mt-6">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              State
            </Text>
            <Text className="text-sm px-2 mt-3">{stateOrProvince}</Text>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Country
            </Text>
            <Text className="text-sm px-2 mt-3">{country}</Text>
          </Box>
        </Box>
      </Box>
      <EditFormPopover
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Business Address">
        {
          <BusinessAddressForm
            onClose={() => setShowModal(false)}
            disabled={false}
            street={street}
            street2={street2}
            country={country}
            stateOrProvince={stateOrProvince}
            city={city}
            postalCode={postalCode}
          />
        }
      </EditFormPopover>
    </Stack>
  );
};

export default BusinessAddressCard;
