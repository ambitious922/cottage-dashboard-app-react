import { DateRangeInput, GetCouponInput, getCouponOrdersQuery, PaginationInput } from "API";
import { GraphQLResult } from '@aws-amplify/api';
import { useGetCouponOrders } from "api/query-hooks/coupon";
import { AppContext } from "App";
import { TABLE_PAGINATION_SIZE } from "constants/index";
import { useContext, useState } from "react";
import { Spinner } from 'components/Common/Spinner';
import CottagePagination from "components/Common/CottagePagination";
import CouponDetailTableHeader from './CouponDetailsTableHeader';

interface CouponDetailTableOrderHistoryProps {
    couponId: string;
}

export interface ICouponDetailsTableOrderHistoryData {
    id: string;
    number?: string | null;
    createdAt: string;
    customerName: string;
    email: string;
    couponAmount?: number;
    total?: number;
    currency?: string;
}


const CouponDetailsTableOrderHistory: React.FC<CouponDetailTableOrderHistoryProps> = ({ couponId }) => {
    const { businessId } = useContext(AppContext);
    const [endCursors, setEndCursors] = useState<string[]>([]);
    const [endCursorsIndex, setEndCursorsIndex] = useState(-1);

    const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

    const couponInput: GetCouponInput = {
        businessId,
        couponId,
    };

    // TODO when date time search filter is implemented revisit this with a 
    // library like luxon
    const filters: DateRangeInput = {
        start: (0).toString(),
        end: (Date.now()).toString(),
    }

    const pagination: PaginationInput = {
        first: TABLE_PAGINATION_SIZE,
        after,
    };

    // TODO passing datetime filter was spinning out, probably because Date.now() was always new
    // causing a refetch in react query. This unblocks for now
    const couponOrdersQuery = useGetCouponOrders(couponInput, undefined, pagination, {
        onSettled: (data) => {
            const endCursor = data?.data?.coupon?.orders?.pageInfo.endCursor;
            if (endCursor) {
                setEndCursors([...endCursors, endCursor]);
            }
        },
    });

    const pageInfo = couponOrdersQuery.data?.data?.coupon?.orders?.pageInfo;


    const orderList: ICouponDetailsTableOrderHistoryData[] =
        couponOrdersQuery.data?.data?.coupon?.orders?.edges.map((e) => {
            return {
                ...e.node,
                customerName: `${e.node.consumer.firstName} ${e.node.consumer.lastName}`,
                email: e.node.consumer.email,
                couponAmount: e.node.cost?.total?.amount,
                total: e.node.cost?.total?.amount,
                currency: e.node.cost?.total?.currency.symbol,
            };
        }) || [];


    const renderTableBody = () => {
        if (couponOrdersQuery.isLoading) {
            return (
                <tr>
                  <td colSpan={7}>
                    <Spinner />
                  </td>
                </tr>
            );
        }

        if (couponOrdersQuery.isError) {
            return (
                <tr>
                    <td colSpan={7} className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
                        Nobody has used this coupon.
                    </td>
                </tr>
            );
        }

        if (orderList.length === 0) {
            return (
                <tr>
                    <td colSpan={7} className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
                        Nobody has used this coupon.
                    </td>
                </tr>
            );
        }

        return orderList.map((order) => (
            <tr key={order.id}>
                <td className="px-0 py-5 text-xs font-semibold text-left whitespace-nowrap">
                    {order.number || "--"}
                </td>
                <td className="px-0 py-5 text-sm text-left whitespace-nowrap">
                    {order.createdAt}
                </td>
                <td className="px-0 py-5 text-sm font-semibold text-left whitespace-nowrap">
                    {order.customerName}
                </td>
                <td className="px-0 py-5 text-sm text-left whitespace-nowrap">
                    {order.email}
                </td>
                <td className="px-0 py-5 text-sm text-right whitespace-nowrap">
                    {`${order.currency}${((order.total || 0) * 100)}`}
                </td>
                <td className="px-0 py-5 text-sm text-right whitespace-nowrap">
                    {`${order.currency}${((order.couponAmount || 0) * 100)}`}
                </td>
                <td className="px-0 py-5 text-sm text-right whitespace-nowrap">
       
                </td>
            </tr>
        ));
    };

    const totalOrdersString = `${couponOrdersQuery.isLoading ? '-' : orderList.length}`;

    return (
        <div className="flex flex-col my-6 text-darkGreen">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
                        <CouponDetailTableHeader
                            totalOrdersString={totalOrdersString}
                            activeTab="order"
                        />
                        <table className="min-w-full divide-y divide-gray-200 mt-6">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                                        Order
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                                        Customer
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                                        Total Order
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                                        Discount Applied
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-0 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right w-auto sm:w-40">                                        
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
                        </table>
                        <CottagePagination
                            isLoading={couponOrdersQuery.isLoading}
                            currentPageSize={orderList.length}
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

export default CouponDetailsTableOrderHistory;
