import { useContext, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';

import { ArchiveDeliveryInput, getLocationDeliveriesQuery, PaginationInput } from 'API';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';

import CottageMenu from 'components/Common/CottageMenu';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import CottagePagination from 'components/Common/CottagePagination';
import { useArchiveDelivery, useGetLocationDeliveries } from 'api/query-hooks/delivery';
import { displayableMonetaryValue } from 'utils';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { Button } from '@chakra-ui/react';
import EditFormPopover from 'components/Common/EditFormPopover';
import DeliveryForm from '../DeliveryForm';
import { DeliveryFormValues } from '../DeliveryForm/DeliveryFormFields';
import { DeliveryErrors } from 'models/error';

interface IDeliveryTableProps {
  showCreateModal: () => void;
}

interface DeliveryModalState {
  deleteVisible: boolean;
  editVisible: boolean;
  deliveryId?: string;
  deliveryFormFields?: DeliveryFormValues;
}

const initialDeliveryModalState = {
  deleteVisible: false,
  editVisible: false,
};

const DeliveryTable: React.FC<IDeliveryTableProps> = ({ showCreateModal }) => {
  const { businessId, locationId } = useContext(AppContext);
  const [modalState, setModalState] = useState<DeliveryModalState>({
    deleteVisible: false,
    editVisible: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);

  const archiveDeliveryMutation = useArchiveDelivery();

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const locationDeliveriesQuery = useGetLocationDeliveries({ id: locationId }, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getLocation?.deliveries?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const pageInfo = locationDeliveriesQuery.data?.data?.getLocation?.deliveries?.pageInfo;

  const deliveriesList =
    locationDeliveriesQuery.data?.data?.getLocation?.deliveries?.edges.map((e) => e.node) || [];

  const handleEditClick = (
    deliveryId: string,
    minimumTotal: number,
    fee: number,
    postalCodes: string
  ) => {
    setModalState({
      ...modalState,
      editVisible: true,
      deliveryId,
      deliveryFormFields: { minimumTotal, fee, postalCodes },
    });
  };

  const handleArchiveClick = (deliveryId: string) => {
    setModalState({
      ...modalState,
      deleteVisible: true,
      deliveryId,
    });
  };

  const onCancelClick = async () => {
    setErrorMessage('');
    setModalState(initialDeliveryModalState);
  };

  const onArchiveDelivery = async () => {
    setErrorMessage('');

    if (!modalState.deliveryId) {
      return;
    }

    const input: ArchiveDeliveryInput = {
      businessId,
      locationId,
      deliveryId: modalState.deliveryId,
    };

    try {
      await archiveDeliveryMutation.mutateAsync(input);
      setModalState(initialDeliveryModalState);
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case DeliveryErrors.BusinessNotFoundErrorCode:
        case DeliveryErrors.DeliveryNotFoundErrorCode:
        case DeliveryErrors.LocationNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      setErrorMessage(message);
    }
  };

  const renderTableBody = () => {
    if (locationDeliveriesQuery.isLoading) {
      return (
        <tr>
          <td colSpan={5}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (locationDeliveriesQuery.isError) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (deliveriesList.length === 0) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            This location has no delivery rules.{' '}
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

    return deliveriesList.map((delivery) => (
      <tr key={delivery.id}>
        <td className="px-2 py-5 text-sm font-semibold">
          {displayableMonetaryValue(delivery.minimumTotal)}
        </td>
        <td className="px-2 py-5 text-sm font-semibold">
          {displayableMonetaryValue(delivery.fee)}
        </td>
        <td className="flex items-center px-2 py-5 text-sm">
          {delivery.postalCodes.map((postalCode) => (
            <CottageTag title={postalCode} tagType={CottageTagType.VIEW} tagColor={'#E3EDE9'} />
          ))}
        </td>
        <td className="px-0 py-5 text-xs text-right whitespace-nowrap">
          <CottageMenu
            menuOptions={[
              {
                title: 'Edit',
                onClick: () =>
                  handleEditClick(
                    delivery.id,
                    delivery.minimumTotal.amount,
                    delivery.fee.amount,
                    delivery.postalCodes.toString()
                  ),
              },
              {
                title: 'Delete',
                onClick: () => handleArchiveClick(delivery.id),
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
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left w-1/6">
              Minimum Order
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left w-1/6">
              Fee
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left w-px whitespace-nowrap">
              Postal Codes
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
      <CottagePagination
        isLoading={locationDeliveriesQuery.isLoading}
        currentPageSize={deliveriesList.length}
        onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
        onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
        hasNextPage={!!pageInfo?.hasNextPage}
        hasPreviousPage={!!pageInfo?.hasPreviousPage}
        currentPageIndex={endCursorsIndex + 1}
      />
      {modalState.deleteVisible && (
        <CottageConfirmationModal
          title={`Delete delivery rule`}
          message={
            'Are you sure you want to delete this delivery rule? You can always recreate it later.'
          }
          confirmButtonText={'Delete delivery'}
          onConfirm={onArchiveDelivery}
          onCancel={onCancelClick}
          isLoading={archiveDeliveryMutation.isLoading}
          errorMessage={errorMessage}
        />
      )}
      <EditFormPopover
        isOpen={modalState.editVisible}
        onClose={() => setModalState(initialDeliveryModalState)}
        title="Edit Delivery Rule">
        {
          <DeliveryForm
            deliveryId={modalState.deliveryId}
            deliveryFormValues={modalState.deliveryFormFields}
            onClose={() => setModalState(initialDeliveryModalState)}
          />
        }
      </EditFormPopover>
    </div>
  );
};

export default DeliveryTable;
