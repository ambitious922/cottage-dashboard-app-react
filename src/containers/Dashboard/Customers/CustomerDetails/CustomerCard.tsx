import { Box, Button, Stack, Text, Divider } from '@chakra-ui/react';
import { XCircleIcon, PlayIcon, CurrencyDollarIcon, PencilIcon } from '@heroicons/react/outline';
import { GetConsumerQuery, UpdateConsumerInput, UserStatus } from 'API';
import { useUpdateConsumerNote, useUpdateConsumerStatus } from 'api/query-hooks/consumer';
import { AppContext } from 'App';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import EditFormPopover from 'components/Common/EditFormPopover';
import { Params } from 'constants/Routes';
import { ConsumerErrors } from 'models/error';
import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { displayableDate, displayableMonetaryValue, displayPhoneNumber } from 'utils';
import CustomerCreditForm from '../CustomerCreditForm/CustomerCreditForm';
import CustomerNoteForm from '../CustomerNoteForm';

export interface CustomerCardProps {
  consumerQueryResponse: GetConsumerQuery;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ consumerQueryResponse }) => {
  const history = useHistory();
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const [errorMessage, setErrorMessage] = useState('');
  const [showDescriptionEditModal, setShowDescriptionEditModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const updateConsumerStatus = useUpdateConsumerStatus();

  if (!consumerQueryResponse.getConsumer) {
    history.push(`/business/${subdomain}/customers/`);
    return <div></div>;
  }

  const consumer = consumerQueryResponse.getConsumer;
  const isBlocked = consumer.status === UserStatus.BLOCKED;

  const clearErrors = () => {
    setErrorMessage('');
  };

  const onBlockCustomer = async () => {
    const input: UpdateConsumerInput = {
      businessId,
      id: consumer.id,
      status: UserStatus.BLOCKED,
    };

    await updateConsumerStatus.mutateAsync(input);
    setShowBlockModal(false);
  };

  const onUnblockCustomer = async () => {
    const input: UpdateConsumerInput = {
      businessId,
      id: consumer.id,
      status: UserStatus.ACTIVE,
    };

    await updateConsumerStatus.mutateAsync(input);
    setShowBlockModal(false);
  };

  const onSubmit = async () => {
    clearErrors();
    try {
      return isBlocked ? await onUnblockCustomer() : await onBlockCustomer();
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      switch (code) {
        case ConsumerErrors.AccessForbiddenErrorCode:
        case ConsumerErrors.ConsumerNotFoundErrorCode:
        default:
          setErrorMessage('Sorry something went wrong');
          break;
      }
    }
  };

  return (
    <Stack direction="column" spacing={4}>
      <Box className="bg-white pl-8 pr-6 py-6 w-full shadow-md rounded-lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          className="block md:flex">
          <Box>
            <Text className="text-sm font-semibold mb-3">Customer Name</Text>
            <Text className="text-base font-semibold text-darkGray mb-6">{`${consumer.firstName} ${consumer.lastName}`}</Text>
            <Box className="grid grid-flow-row grid-cols-3 grid-rows-1 gap-x-16 gap-y-6 my-6">
              <Box alignItems="center">
                {' '}
                <Text className="text-sm font-medium mb-3">Phone Number</Text>
                <Text className="text-base text-darkGray">
                  {/* TODO force shop side to take phone numbers with +1 */}
                  {displayPhoneNumber(consumer.phoneNumber)}
                </Text>
              </Box>
              <Box alignItems="center">
                {' '}
                <Text className="text-sm font-medium mb-3">Email</Text>
                <Text className="text-base text-darkGray whitespace-nowrap">{`${consumer.email}`}</Text>
              </Box>
            </Box>
            <Box className="grid grid-flow-row grid-cols-3 grid-rows-1 gap-x-16 gap-y-6 my-6">
              <Box alignItems="center">
                {' '}
                <Text className="text-sm font-medium mb-3">Customer Since</Text>
                <Text className="text-base text-darkGray">
                  {displayableDate(consumer.createdAt)}
                </Text>
              </Box>
              <Box alignItems="center">
                {' '}
                <Text className="text-sm font-medium mb-3">Credit Balance</Text>
                <Text className="text-base text-darkGray">
                  {displayableMonetaryValue(consumer.creditBalance)}
                </Text>
              </Box>
              <Box alignItems="center">
                {' '}
                <Text className="text-sm font-medium mb-3">Total Spent</Text>
                {/* TODO support this on the backend, this is just a placeholder */}
                <Text className="text-base text-darkGray">
                  {displayableMonetaryValue(consumer.creditBalance)}
                </Text>
              </Box>
            </Box>
            <Divider />
            <Box className="flex items-center gap-6 mt-6 mb-3">
              <Text className="text-sm font-medium">Note</Text>
              <Button
                variant="link"
                colorScheme="cottage-green"
                className="text-sm font-semibold text-lightGreen-100 focus:shadow-none"
                leftIcon={<PencilIcon className="w-4 h-4" />}
                onClick={() => setShowDescriptionEditModal(true)}>
                Edit
              </Button>{' '}
            </Box>
            <Text className="text-sm font-normal text-darkGray my-3">
              {consumer.businessNote || 'Store a note for this customer, only visible to you.'}
            </Text>
          </Box>
          <Box className="ml-0 mt-4 sm:mt-0">
            <Stack direction="column" spacing={4}>
              <Button
                className="h-9 text-sm font-semibold text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
                onClick={() => setShowCreditModal(true)}
                minW="161"
                leftIcon={<CurrencyDollarIcon className="w-5 h-5" />}>
                Apply Debit/Credit
              </Button>
              <Button
                className="h-9 text-sm font-semibold text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
                minW="161"
                onClick={() => setShowBlockModal(true)}
                leftIcon={
                  isBlocked ? <PlayIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />
                }>
                {isBlocked ? 'Unblock Customer' : 'Block Customer'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
      {
        <EditFormPopover
          isOpen={showCreditModal}
          onClose={() => {
            setShowCreditModal(false);
            clearErrors();
          }}
          title="Apply a credit/debit">
          <CustomerCreditForm
            consumerQueryResponse={consumerQueryResponse}
            onClose={() => {
              setShowCreditModal(false);
              clearErrors();
            }}
          />
        </EditFormPopover>
      }
      {showBlockModal && (
        <CottageConfirmationModal
          title={isBlocked ? 'Unblock Customer' : 'Block Customer'}
          message={
            isBlocked
              ? `Are you sure you want to unblock ${`${consumer?.firstName} ${consumer?.lastName}`}? This customer will now be able to order from your business.`
              : `Are you sure you want to block ${`${consumer?.firstName} ${consumer?.lastName}`}? This customer will no longer be able to order from your business. You can always unblock them later.`
          }
          confirmButtonText={isBlocked ? 'Unblock Customer' : 'Block Customer'}
          onConfirm={onSubmit}
          onCancel={() => {
            setShowBlockModal(false);
            clearErrors();
          }}
          isLoading={updateConsumerStatus.isLoading}
          errorMessage={errorMessage}
        />
      )}
      {
        <EditFormPopover
          isOpen={showDescriptionEditModal}
          onClose={() => {
            setShowDescriptionEditModal(false);
            clearErrors();
          }}
          title={'Edit Note'}>
          <CustomerNoteForm
            firstName={consumerQueryResponse.getConsumer?.firstName}
            lastName={consumerQueryResponse.getConsumer?.lastName}
            consumerId={consumerQueryResponse.getConsumer?.id}
            originalBusinessNote={consumerQueryResponse.getConsumer?.businessNote || ''}
            onClose={() => {
              setShowDescriptionEditModal(false);
              clearErrors();
            }}
          />
        </EditFormPopover>
      }
    </Stack>
  );
};

export default CustomerCard;
