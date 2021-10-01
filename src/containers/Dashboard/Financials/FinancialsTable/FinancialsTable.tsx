import { useContext, useState } from 'react';
import { Spinner } from 'components/Common/Spinner';

import {
  BalanceTransactionReportingCategory,
  BalanceTransactionSource,
  BalanceTransactionSourceType,
  BalanceTransactionStatus,
  BalanceTransactionType,
  FilterBalanceTransactionsInput,
  GetBusinessInput,
  MonetaryValue,
  PaginationInput,
} from 'API';
import { AppContext } from 'App';
import CottagePagination from 'components/Common/CottagePagination';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { useGetBusinessBalanceTransactions } from 'api/query-hooks/balancetransactions';
import { displayableDate, displayableMonetaryValue } from 'utils';
import FinancialsTableHeader from '../FinancialsTableHeader';

interface IFinancialsTableProps {}

export interface IFinancialsTableData {
  id: string;
  createdAt: string;
  availableOn: string;
  status: BalanceTransactionStatus;
  type: BalanceTransactionType;
  reportingCategory: BalanceTransactionReportingCategory;
  net: MonetaryValue;
  fee: MonetaryValue;
  amount: MonetaryValue;
  source: BalanceTransactionSource;
}

const FinancialsTable: React.FC<IFinancialsTableProps> = () => {
  const { businessId } = useContext(AppContext);
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const [filters, setFilters] = useState<FilterBalanceTransactionsInput>({});

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const businessInput: GetBusinessInput = { businessId };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const businessBalanceTransactionsQuery = useGetBusinessBalanceTransactions(
    businessInput,
    filters,
    pagination,
    {
      onSettled: (data) => {
        const endCursor = data?.data?.getBusiness?.balanceTransactions?.pageInfo.endCursor;
        if (endCursor) {
          setEndCursors([...endCursors, endCursor]);
        }
      },
    }
  );

  const pageInfo =
    businessBalanceTransactionsQuery.data?.data?.getBusiness?.balanceTransactions?.pageInfo;

  const transactionsList: IFinancialsTableData[] =
    businessBalanceTransactionsQuery.data?.data?.getBusiness?.balanceTransactions?.edges.map(
      (e) => e.node
    ) || [];

  const displayTransactionSourceType = (
    balanceTransactionSourceType: BalanceTransactionSourceType | null | undefined
  ) => {
    switch (balanceTransactionSourceType) {
      case BalanceTransactionSourceType.ORDER:
        return 'Order';
      case BalanceTransactionSourceType.SUBSCRIPTION_INVOICE:
        return 'Subscription';
      case BalanceTransactionSourceType.REFUND:
        return 'Refund';
      case BalanceTransactionSourceType.PAYOUT:
        return 'Payout';
      default:
        return 'n/a';
    }
  };

  const renderTableBody = () => {
    if (businessBalanceTransactionsQuery.isLoading) {
      return (
        <tr>
          <td colSpan={7}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (businessBalanceTransactionsQuery.isError) {
      return (
        <tr>
          <td
            colSpan={7}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (transactionsList.length === 0) {
      return (
        <tr>
          <td
            colSpan={7}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            This is where your financials will appear when you begin processing transactions.
          </td>
        </tr>
      );
    }

    return transactionsList.map((transaction) => (
      <tr key={transaction.id} className={'bg-white'}>
        <td className="px-2 py-5 text-xs font-semibold text-left">
          {displayableDate(transaction.createdAt)}
        </td>
        <td className="px-2 py-5 text-xs font-semibold text-left">
          {displayableDate(transaction.availableOn)}
        </td>
        <td className="px-2 py-5 text-xs font-normal text-left">
          {displayTransactionSourceType(transaction.source?.type)}
        </td>
        <td className="px-2 py-5 text-xs font-normal text-right">
          {displayableMonetaryValue(transaction.amount)}
        </td>
        <td className="px-2 py-5 text-xs font-normal text-right">TODO</td>
        <td className="px-2 py-5 text-xs text-error font-normal text-right">
          {displayableMonetaryValue(transaction.fee)}
        </td>
        <td className="px-2 py-5 text-xs font-semibold text-right">
          {displayableMonetaryValue(transaction.net)}
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col my-8">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
            <FinancialsTableHeader
              totalFinancials={transactionsList.length}
              setFilters={setFilters}
            />
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Available
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Gross
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Sales Tax
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Fees
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={businessBalanceTransactionsQuery.isLoading}
              currentPageSize={transactionsList.length}
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

export default FinancialsTable;
