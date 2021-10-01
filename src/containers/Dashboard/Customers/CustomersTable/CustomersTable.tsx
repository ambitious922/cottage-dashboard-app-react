import {
  FilterConsumersInput,
  getBusinessConsumersQuery,
  GetBusinessInput,
  MonetaryValue,
  PaginationInput,
  UpdateConsumerInput,
  UserStatus,
} from 'API';
import { useGetBusinessConsumers, useUpdateConsumerStatus } from 'api/query-hooks/consumer';
import { AppContext } from 'App';
import { GraphQLResult } from '@aws-amplify/api';

import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { Params } from 'constants/Routes';
import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import CottageMenu from 'components/Common/CottageMenu';
import CottageConfirmationModal from 'components/Common/CottageConfirmationModal';
import CottagePagination from 'components/Common/CottagePagination';
import CustomerTableHeader from '../CustomerTableHeader';
import { Spinner } from 'components/Common/Spinner';

import { Link } from 'react-router-dom';
import { displayableDate, displayableMonetaryValue, displayPhoneNumber } from 'utils';
import { ConsumerErrors } from 'models/error';

interface ICustomersTableProps {}

interface CustomerModalState {
  visible: boolean;
  consumer?: ICustomersTableData;
}

export const CustomersTabName = {
  ACTIVE: 'Active',
  BLOCKED: 'Blocked',
};

const tabs: CottageTab[] = [
  { name: CustomersTabName.ACTIVE, href: '#', current: true, count: 0 },
  { name: CustomersTabName.BLOCKED, href: '#', current: false, count: 0 },
];

export interface ICustomersTableData {
  id: string;
  customerId: string;
  status: UserStatus;
  customerName: string;
  email: string;
  phoneNumber?: string | null;
  customerSince: string;
  creditBalance: MonetaryValue;
  totalSpend: number | 0;
}

const CustomersTable: React.FC<ICustomersTableProps> = () => {
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const history = useHistory();

  const [activeTab, setActiveTab] = useState(CustomersTabName.ACTIVE);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalState, setModalState] = useState<CustomerModalState>({ visible: false });
  const [activeTabFilters, setActiveTabFilters] = useState<FilterConsumersInput>({
    status: UserStatus.ACTIVE,
  });
  const [blockedTabfilters, setBlockedTabFilters] = useState<FilterConsumersInput>({
    status: UserStatus.BLOCKED,
  });
  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const businessInput: GetBusinessInput = { businessId };
  const filters = activeTab === CustomersTabName.ACTIVE ? activeTabFilters : blockedTabfilters;
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const businessConsumersQuery = useGetBusinessConsumers(businessInput, filters, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getBusiness?.consumers?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const pageInfo = businessConsumersQuery.data?.data?.getBusiness?.consumers?.pageInfo;

  const handleBlockCustomerClick = (consumer: ICustomersTableData) => {
    setModalState({ visible: true, consumer });
  };

  const onCancelClick = async () => {
    setErrorMessage('');
    setModalState({ ...modalState, visible: false });
  };

  const updateConsumerStatus = useUpdateConsumerStatus();

  const onBlockCustomer = async () => {
    setErrorMessage('');

    if (!modalState.consumer) {
      return;
    }

    const input: UpdateConsumerInput = {
      businessId,
      id: modalState.consumer.id,
      status: UserStatus.BLOCKED,
    };

    try {
      await updateConsumerStatus.mutateAsync(input);
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      switch (code) {
        case ConsumerErrors.ConsumerNotFoundErrorCode:
        case ConsumerErrors.AccessForbiddenErrorCode:
        default:
          setErrorMessage('Something went wrong');
          break;
      }
    }
  };

  const consumerList: ICustomersTableData[] =
    businessConsumersQuery.data?.data?.getBusiness?.consumers?.edges.map((e) => {
      const { firstName, lastName, phoneNumber, createdAt, creditBalance, status } = e.node;
      return {
        ...e.node,
        status,
        customerName: `${firstName} ${lastName}`,
        customerSince: createdAt,
        creditBalance,
        // TODO this needs to come from the backend once supported via ES
        totalSpend: 0,
      };
    }) || [];

  const renderTableBody = () => {
    if (businessConsumersQuery.isLoading) {
      return (
        <tr>
          <td colSpan={8}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (businessConsumersQuery.isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            No customers to show.
          </td>
        </tr>
      );
    }

    if (consumerList.length === 0) {
      return (
        <tr>
          {activeTab === CustomersTabName.ACTIVE && Object.values(filters).length === 1 ? (
            <td
              colSpan={8}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              Customers will be displayed here as soon as they sign up on your website.
            </td>
          ) : (
            <td
              colSpan={8}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              No customers to display.
            </td>
          )}
        </tr>
      );
    }

    return consumerList.map((consumer) => (
      <tr
        key={consumer.id}
        className="hover:bg-lightGrey-100 cursor-pointer"
        onClick={() => {
          history.push(`/business/${subdomain}/customers/${consumer.customerId}`);
        }}>
        <td className="px-2 py-5 text-sm font-semibold text-left">
          <Link to={`/business/${subdomain}/customers/${consumer.customerId}`}>
            {consumer.customerName}
          </Link>
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">{consumer.email}</td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">
          {displayPhoneNumber(consumer.phoneNumber)}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">
          {displayableDate(consumer.customerSince)}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray text-right">
          {displayableMonetaryValue(consumer.creditBalance)}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray text-right">
          {consumer.totalSpend}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray text-right">
          <CottageMenu
            menuOptions={[
              {
                title:
                  consumer.status === UserStatus.BLOCKED ? 'Unblock Customer' : 'Block Customer',
                onClick: () => handleBlockCustomerClick(consumer),
              },
            ]}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col my-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <CottageTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={(tabName: string) => {
                setActiveTab(tabName);
              }}
            />
            {/* TODO can't support this due to vulnerability of hitting the SES bounce rate 
            <div className="flex md:ml-4">
              <Button
                className="flex items-center h-9 text-sm font-semibold focus:outline-none focus:shadow-none"
                type="submit"
                colorScheme="cottage-green"
                size="md"
                isFullWidth
                onClick={pushToCreateCustomer}>
                <UserAddIcon className="w-4 h-4 mr-1" />
                Send Invite
              </Button>
            </div> */}
          </div>
          <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
            {/* For some reason a ternary was not working so defaulted to this approach */}
            {activeTab === CustomersTabName.ACTIVE && (
              <CustomerTableHeader
                totalCustomers={consumerList.length}
                setFilters={(filters) =>
                  setActiveTabFilters({ ...filters, status: UserStatus.ACTIVE })
                }
                activeTab={activeTab}
              />
            )}
            {activeTab === CustomersTabName.BLOCKED && (
              <CustomerTableHeader
                totalCustomers={consumerList.length}
                setFilters={(filters) =>
                  setBlockedTabFilters({ ...filters, status: UserStatus.BLOCKED })
                }
                activeTab={activeTab}
              />
            )}
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Joined on
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Credit Balance
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Total spent
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={businessConsumersQuery.isLoading}
              currentPageSize={consumerList.length}
              onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
              onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
              hasNextPage={!!pageInfo?.hasNextPage}
              hasPreviousPage={!!pageInfo?.hasPreviousPage}
              currentPageIndex={endCursorsIndex + 1}
            />
          </div>
          {modalState.visible && (
            <CottageConfirmationModal
              title={
                modalState.consumer?.status === UserStatus.BLOCKED
                  ? 'Unblock Customer'
                  : 'Block Customer'
              }
              message={
                modalState.consumer?.status === UserStatus.BLOCKED
                  ? `Are you sure you want to block ${modalState.consumer?.customerName}? This customer will no longer be able to order from your business. You can always unblock them later.`
                  : `Are you sure you want to unblock ${modalState.consumer?.customerName}? This customer will now be able to order from your business.r.`
              }
              confirmButtonText={'Block Customer'}
              onConfirm={onBlockCustomer}
              onCancel={onCancelClick}
              isLoading={updateConsumerStatus.isLoading}
              errorMessage={errorMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersTable;
