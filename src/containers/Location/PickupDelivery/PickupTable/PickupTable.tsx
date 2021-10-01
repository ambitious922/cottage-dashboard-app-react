import { useContext, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';

import { ArchivePickupAddressInput, getLocationPickupAddressesQuery, PaginationInput } from 'API';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';

import CottageMenu from 'components/Common/CottageMenu';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import {
  useArchivePickupAddress,
  useGetLocationPickupAddresses,
} from 'api/query-hooks/pickupaddresses';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import CottagePagination from 'components/Common/CottagePagination';
import { Button } from '@chakra-ui/react';
import { PickupLocationErrors } from 'models/error';

interface IPickupTableProps {
  showCreateModal: () => void;
}

interface PickupModalState {
  visible: boolean;
  addressId?: string;
  addressStreet?: string;
}

const PickupTable: React.FC<IPickupTableProps> = ({ showCreateModal }) => {
  const { businessId, locationId } = useContext(AppContext);
  const [modalState, setModalState] = useState<PickupModalState>({ visible: false });
  const [errorMessage, setErrorMessage] = useState('');
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);

  const archivePickupAddressMutation = useArchivePickupAddress();

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const locationPickupAddressesQuery = useGetLocationPickupAddresses(
    { id: locationId },
    pagination,
    {
      onSettled: (data) => {
        const endCursor = data?.data?.getLocation?.pickupAddresses?.pageInfo.endCursor;
        if (endCursor) {
          setEndCursors([...endCursors, endCursor]);
        }
      },
    }
  );

  const pageInfo = locationPickupAddressesQuery.data?.data?.getLocation?.pickupAddresses?.pageInfo;

  const pickupAddressesList =
    locationPickupAddressesQuery.data?.data?.getLocation?.pickupAddresses?.edges.map(
      (e) => e.node
    ) || [];

  const handleArchiveClick = (addressId: string, fullStreeName: string) => {
    setModalState({
      visible: true,
      addressId,
      addressStreet: fullStreeName,
    });
  };

  const onCancelClick = async () => {
    setErrorMessage('');
    setModalState({ visible: false });
  };

  const onArchivePickupAddress = async () => {
    setErrorMessage('');

    if (!modalState.addressId) {
      return;
    }

    const input: ArchivePickupAddressInput = {
      businessId,
      locationId,
      addressId: modalState.addressId,
    };

    try {
      await archivePickupAddressMutation.mutateAsync(input);
      setModalState({ ...modalState, visible: false });
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case PickupLocationErrors.PickupAddressNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      setErrorMessage(message);
    }
  };

  const renderTableBody = () => {
    if (locationPickupAddressesQuery.isLoading) {
      return (
        <tr>
          <td colSpan={8}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (locationPickupAddressesQuery.isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (pickupAddressesList.length === 0) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            This location has no pickup locations.{' '}
            {
              <Button
                variant="link"
                fontSize="14px"
                fontWeight="400"
                colorScheme="cottage-green"
                className="text-lightGreen-100 font-semibold focus:shadow-none"
                onClick={showCreateModal}>
                Create one now.
              </Button>
            }
          </td>
        </tr>
      );
    }

    return pickupAddressesList.map((pickupAddress) => (
      <tr key={pickupAddress.id}>
        <td className="px-2 py-5 text-sm font-semibold">
          {pickupAddress.street}
          {' ' + (pickupAddress.street2 || '')}
        </td>
        <td className="px-2 py-5 text-sm">{pickupAddress.city}</td>
        <td className="px-2 py-5 text-sm">{pickupAddress.stateOrProvince}</td>
        <td className="px-2 py-5 text-sm">{pickupAddress.postalCode}</td>
        <td className="px-2 py-5 text-sm">{pickupAddress.country}</td>
        <td className="px-2 py-5 text-sm">{pickupAddress.title || '--'}</td>
        <td className="px-0 py-5 text-xs text-right whitespace-nowrap">
          <CottageMenu
            menuOptions={[
              {
                title: 'Delete',
                onClick: () =>
                  handleArchiveClick(
                    pickupAddress.id,
                    `${pickupAddress.street} ${pickupAddress.street2 || ''}`
                  ),
              },
            ]}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="mt-4 mb-1">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Street Address
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              City
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              State
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Zip code
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Country
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Title
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      <CottagePagination
        isLoading={locationPickupAddressesQuery.isLoading}
        currentPageSize={pickupAddressesList.length}
        onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
        onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
        hasNextPage={!!pageInfo?.hasNextPage}
        hasPreviousPage={!!pageInfo?.hasPreviousPage}
        currentPageIndex={endCursorsIndex + 1}
      />
      {modalState.visible && (
        <CottageConfirmationModal
          title={`Delete ${modalState.addressStreet}`}
          message={
            'Are you sure you want to delete this pickup location? You can always recreate it later.'
          }
          confirmButtonText={'Delete pickup location'}
          onConfirm={onArchivePickupAddress}
          onCancel={onCancelClick}
          isLoading={archivePickupAddressMutation.isLoading}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default PickupTable;
