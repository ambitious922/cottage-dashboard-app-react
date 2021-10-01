import React, { useContext, useState } from 'react';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { TrashIcon } from '@heroicons/react/solid';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { useArchiveLocation } from 'api/query-hooks/location';
import { Spinner } from 'components/Common/Spinner/Spinner';
import { AppContext } from 'App';
import { ArchiveLocationInput } from 'API';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { LocationErrors } from 'models/error';

const ArchiveLocationCard: React.FC = () => {
  const { businessId, locationId } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const archiveLocationMutation = useArchiveLocation();

  const clearErrors = () => {
    setErrorMessage('');
  };

  const onSubmit = async () => {
    clearErrors();

    const input: ArchiveLocationInput = {
      businessId,
      locationId,
    };
    try {
      await archiveLocationMutation.mutateAsync(input);
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      switch (code) {
        case LocationErrors.LocationNotFoundErrorCode:
        default:
          setErrorMessage('Sorry something went wrong');
          break;
      }
    }
  };

  if (archiveLocationMutation.isLoading) {
    return <Spinner />;
  }

  if (archiveLocationMutation.isError) {
    return <>Something went wrong</>;
  }

  return (
    <Stack className="flex flex-row bg-white my-4 p-6 rounded-lg">
      {showModal ? (
        <CottageConfirmationModal
          title="Archive this location?"
          message="All location level resources will be deleted. You will no longer have access to this location or any of its data. If you have existing subscribers this action is not permissible. You will need to cancel each subscription manually."
          onCancel={() => {
            clearErrors();
            setShowModal(false);
          }}
          onConfirm={onSubmit}
          isLoading={archiveLocationMutation.isLoading}
          errorMessage={errorMessage}
          confirmButtonText="Archive"
          cancelButtonText="Cancel"
        />
      ) : null}
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Archive Location
        </Text>
      </Box>
      <Box style={{ width: '75%' }} className="pl-6 m-0">
        <Button
          colorScheme="cottage-green"
          size="md"
          className="text-sm font-semibold mb-4 focus:outline-none focus:shadow-none"
          onClick={() => setShowModal(true)}>
          <TrashIcon className="h-5 w-5 mr-3" /> Archive This Location
        </Button>
        <div className="flex gap-4 px-6 py-4 rounded-lg" style={{ background: '#FCF9E9' }}>
          <div>
            <QuestionMarkCircleIcon className="text-black h-7 w-7" />
          </div>
          <span className="text-sm text-darkGray">
            <span className="font-bold">Please note: </span>
            All location level resources will be deleted. You will no longer have access to this
            location on the side bar.
          </span>
        </div>
      </Box>
    </Stack>
  );
};

export default ArchiveLocationCard;
