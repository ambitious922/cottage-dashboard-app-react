import React, { useState } from 'react';
import { Stack, Box, Button, Text } from '@chakra-ui/react';
import { PencilIcon } from '@heroicons/react/solid';
import EditFormPopover from 'components/Common/EditFormPopover';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { TaxRate } from 'API';
import LocationTaxForm from './LocationTaxForm';
import { displayPercentage } from 'utils';

export interface LocationUrlSectionProps {
  taxRate: TaxRate;
}

const LocationTaxCard: React.FC<LocationUrlSectionProps> = ({ taxRate }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Stack className="flex flex-row bg-white my-4 p-6 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Sales Tax
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          Declare a sales tax rate to be applied to all orders and subscriptions.
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
      <Box style={{ width: '75%' }} className="pl-4 m-0">
        <Box className="grid grid-flow-col grid-cols-1 grid-rows-1 gap-6 mb-8">
          <Box>
            <Text fontSize="14px" fontWeight="500" className="px-2">
              Sales Tax Rate
            </Text>
            <Text className="text-sm px-2 mt-3">{displayPercentage(taxRate.rate)}</Text>
          </Box>
        </Box>
        <div className="flex gap-4 px-6 py-4 rounded-lg" style={{ background: '#FCF9E9' }}>
          <div>
            <QuestionMarkCircleIcon className="text-black h-7 w-7" />
          </div>
          <span className="text-sm text-darkGray">
            <span className="font-bold">Please note: </span>
            Cottage assumes no responsibility for determining if you are not collecting sufficient
            sales tax. If in doubt, consult a tax professional.
          </span>
        </div>
      </Box>
      <EditFormPopover isOpen={showModal} onClose={() => setShowModal(false)} title="Sales Tax">
        <LocationTaxForm taxRate={taxRate} onClose={() => setShowModal(false)} />
      </EditFormPopover>
    </Stack>
  );
};

export default LocationTaxCard;
