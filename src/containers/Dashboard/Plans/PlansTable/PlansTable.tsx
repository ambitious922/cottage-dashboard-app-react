import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Box, Text } from '@chakra-ui/react';
import {
  FilterPlansInput,
  GetBusinessInput,
  MonetaryValue,
  PaginationInput,
  PlanInterval,
  PlanStatus,
} from 'API';
import Link from 'components/Common/Link';
import { AppContext } from 'App';
import CottagePagination from 'components/Common/CottagePagination';
import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { Params } from 'constants/Routes';
import { useGetBusinessPlans } from 'api/query-hooks/plans';
import PlanTableHeader from '../PlanTableHeader';
import { Spinner } from 'components/Common/Spinner';
import { displayableMonetaryValue, displayablePlanInterval } from 'utils';
import { ChevronRightIcon } from '@heroicons/react/outline';

interface IPlanTableProps {}

export const PlansTabName = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
};

const tabs: CottageTab[] = [
  { name: PlansTabName.ACTIVE, href: '#', current: true, count: 0 },
  { name: PlansTabName.ARCHIVED, href: '#', current: false, count: 0 },
];

export interface IPlansTableData {
  id: string;
  status: PlanStatus;
  title: string;
  interval: PlanInterval;
  images: string[];
  description?: string | null;
  price: MonetaryValue;
  value: MonetaryValue;
  subscriberTotal?: number | null;
}

const PlansTable: React.FC<IPlanTableProps> = () => {
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const [activeTab, setActiveTab] = useState(PlansTabName.ACTIVE);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const history = useHistory();

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const businessInput: GetBusinessInput = { businessId };
  const filters: FilterPlansInput = {
    status: activeTab === PlansTabName.ACTIVE ? PlanStatus.ACTIVE : PlanStatus.ARCHIVED,
  };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };
  const businessPlansQuery = useGetBusinessPlans(businessInput, filters, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getBusiness?.plans?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const pageInfo = businessPlansQuery.data?.data?.getBusiness?.plans?.pageInfo;

  const planList: IPlansTableData[] =
    businessPlansQuery.data?.data?.getBusiness?.plans?.edges.map((e) => {
      return {
        ...e.node,
        subscriberTotal: e.node.subscriptions?.total,
      };
    }) || [];

  const plans = planList || [];

  const renderTableBody = () => {
    if (businessPlansQuery.isLoading || businessPlansQuery.isFetching) {
      return (
        <tr>
          <td colSpan={7}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (businessPlansQuery.isError) {
      return (
        <tr>
          <td
            colSpan={7}
            className="px-40 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (plans.length === 0) {
      return (
        <tr>
          {activeTab === PlansTabName.ACTIVE && Object.values(filters).length === 1 ? (
            <td
              colSpan={7}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              You have not created any plans yet.
              {
                <Link
                  className="text-lightGreen-100 mt-4 ml-1 font-semibold focus:shadow-none hover:underline"
                  to={`/business/${subdomain}/plans/new`}>
                  Create your first plan.
                </Link>
              }
            </td>
          ) : (
            <td
              colSpan={7}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              No plans were found.
            </td>
          )}
        </tr>
      );
    }

    return plans.map((plan) => (
      <tr
        key={plan.id}
        className="hover:bg-lightGrey-100 cursor-pointer"
        onClick={() => {
          history.push(`/business/${subdomain}/plans/${plan.id}`);
        }}>
        <td className="px-2 py-2 text-sm text-left">
          <Box boxSize="56px">
            <div
              className="w-full h-full bg-cover rounded-lg"
              style={{
                backgroundImage: `url(${
                  plan.images[0] || 'https://cdn.cottage.menu/assets/common/default_food_image.svg'
                })`,
              }}></div>
          </Box>
        </td>
        <td className="px-2 py-2 text-sm font-medium text-darkGreen text-left align-middle">
          <Text
            className="text-sm font-medium text-darkGreen text-left hover:underline cursor-pointer overflow-hidden overflow-ellipsis"
            noOfLines={1}>
            {plan.title}
          </Text>
        </td>
        <td className="px-2 py-2 text-sm text-darkGray text-right">
          {displayablePlanInterval(plan.interval)}
        </td>
        <td className="px-2 py-2 text-sm font-semibold text-darkGray text-right">
          {displayableMonetaryValue(plan.value)}
        </td>
        <td className="px-2 py-2 text-sm font-semibold text-darkGray text-right">
          {displayableMonetaryValue(plan.price)}
        </td>
        <td className="px-2 py-2 text-sm text-darkGray text-right align-middle">
          {plan.subscriberTotal}
        </td>
        <td className="px-4 py-2 text-sm font-semibold">
          <ChevronRightIcon
            className="w-5 h-5 ml-auto text-lightGreen-100 whitespace-nowrap cursor-pointer"
            onClick={() => {
              history.push(`/business/${subdomain}/plans/${plan.id}`);
            }}
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
              onTabClick={(tabName: string) => setActiveTab(tabName)}
            />
          </div>
          <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
            <PlanTableHeader totalPlans={planList.length} activeTab={activeTab} />
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left"
                    style={{ width: '80px' }}>
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Renews
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Value
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Subscribers
                  </th>
                  <th
                    scope="col"
                    className="px-4 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right whitespace-nowrap"
                    style={{ width: '100px' }}></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={businessPlansQuery.isLoading}
              currentPageSize={planList.length}
              onNextPage={() => setEndCursorsIndex(endCursorsIndex + 1)}
              onPreviousPage={() => setEndCursorsIndex(endCursorsIndex - 1)}
              hasNextPage={!!pageInfo?.hasNextPage}
              hasPreviousPage={!!pageInfo?.hasPreviousPage}
              currentPageIndex={endCursorsIndex + 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansTable;
