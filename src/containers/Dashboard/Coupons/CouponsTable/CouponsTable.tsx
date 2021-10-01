import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import {
  CouponType,
  CouponStatus,
  GetBusinessInput,
  FilterCouponsInput,
  PaginationInput,
  MonetaryValue,
} from 'API';
import Link from 'components/Common/Link';
import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import { useGetBusinessCoupons } from 'api/query-hooks/coupon';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';
import { Params } from 'constants/Routes';

import CouponTableHeader from '../CouponTableHeader/index';
import CottagePagination from 'components/Common/CottagePagination';
import { TABLE_PAGINATION_SIZE } from 'constants/index';

import { displayableMonetaryValue } from 'utils';

interface ICouponTableProps {}

export const CouponTabName = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
};

const tabs: CottageTab[] = [
  { name: CouponTabName.ACTIVE, href: '#', current: true, count: 0 },
  { name: CouponTabName.ARCHIVED, href: '#', current: false, count: 0 },
];

export interface ICouponTableData {
  id: string;
  type: CouponType;
  name: string;
  minimumTotal: MonetaryValue;
  percentOff?: number | null;
  amountOff?: MonetaryValue | null;
}

const CouponsTable: React.FC<ICouponTableProps> = () => {
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const [activeTab, setActiveTab] = useState(CouponTabName.ACTIVE);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const history = useHistory();

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const businessInput: GetBusinessInput = { businessId };
  const filters: FilterCouponsInput = {
    status: activeTab === CouponTabName.ACTIVE ? CouponStatus.ACTIVE : CouponStatus.ARCHIVED,
  };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };
  const businessCouponsQuery = useGetBusinessCoupons(businessInput, filters, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getBusiness?.coupons?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const pageInfo = businessCouponsQuery.data?.data?.getBusiness?.coupons?.pageInfo;

  const couponList: ICouponTableData[] =
    businessCouponsQuery.data?.data?.getBusiness?.coupons?.edges.map((e) => e.node) || [];

  const coupons = couponList || [];

  const onTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderTableBody = () => {
    if (businessCouponsQuery.isLoading || businessCouponsQuery.isFetching) {
      return (
        <tr>
          <td colSpan={5}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (businessCouponsQuery.isError) {
      return (
        <tr>
          <td
            colSpan={5}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            Something went wrong
          </td>
        </tr>
      );
    }

    if (coupons.length === 0) {
      return (
        <tr>
          {activeTab === CouponTabName.ACTIVE && Object.values(filters).length === 1 ? (
            <td
              colSpan={5}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              You have not created any coupons yet.
              {
                <Link
                  className="text-lightGreen-100 mt-4 ml-1 font-semibold focus:shadow-none hover:underline"
                  to={`/business/${subdomain}/coupons/new`}>
                  Create your first coupon.
                </Link>
              }
            </td>
          ) : (
            <td
              colSpan={5}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              No coupons were found.
            </td>
          )}
        </tr>
      );
    }

    return couponList.map((coupon) => (
      <tr
        key={coupon.name}
        className="hover:bg-lightGrey-100 cursor-pointer"
        onClick={() => {
          history.push(`/business/${subdomain}/coupons/${coupon.id}`);
        }}>
        <td className="px-2 py-5 text-sm font-medium text-darkGreen">{coupon.name}</td>
        <td className="px-2 py-5 text-sm text-gray-500">No date restrictions</td>
        <td className="px-2 py-5 text-sm text-gray-500 text-right">TODO</td>
        <td className="px-2 py-5 text-sm text-gray-500 font-semibold text-right">
          {displayableMonetaryValue(coupon.minimumTotal)}
        </td>
        <td className="px-2 py-5 text-sm text-gray-500 font-semibold text-right">
          {coupon.type === CouponType.AMOUNT_OFF ? (
            <span>{displayableMonetaryValue(coupon.amountOff)}</span>
          ) : (
            <span>{(coupon.percentOff || 0) * 100}%</span>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col my-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <CottageTabs tabs={tabs} activeTab={activeTab} onTabClick={onTabClick} />
          </div>
          <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
            <CouponTableHeader totalCoupons={couponList.length} activeTab={activeTab} />
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Coupon Code
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Active Dates
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Used
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Min. Purchase
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Value Off
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={businessCouponsQuery.isLoading}
              currentPageSize={couponList.length}
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

export default CouponsTable;
