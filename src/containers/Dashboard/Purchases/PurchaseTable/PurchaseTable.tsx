import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import { useState, useContext, useRef } from 'react';

import OrdersTable from '../OrdersTable';
import SubscriptionsTable from '../SubscriptionsTable';

import { Radio, RadioGroup, Button, Stack, Select, Text, Box } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useExportOrders } from 'api/query-hooks/order';
import { AppContext } from 'App';
import EditFormPopover from 'components/Common/EditFormPopover';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { OrderErrors } from 'models/error';

interface PurchaseTableProps {}
export interface PurchaseTab {
  name: string;
  href: string;
  current: boolean;
  count: number;
}

export const PurchaseTabName = {
  ORDERS: 'Orders',
  SUBSCRIPTION_INVOICE: 'Subscription Invoices',
};

const tabs: CottageTab[] = [
  { name: PurchaseTabName.ORDERS, href: '#', current: true, count: 0 },
  { name: PurchaseTabName.SUBSCRIPTION_INVOICE, href: '#', current: false, count: 0 },
];

interface DateRangeTab {
  display: string;
  dateRange: {
    start: string;
    end: string;
  };
}

const PurchasesTable: React.FC<PurchaseTableProps> = () => {
  const cancelRef = useRef();
  const { businessId } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(PurchaseTabName.ORDERS);
  const [range, setRange] = useState<DateRangeTab>({
    display: 'Today',
    dateRange: {
      start: DateTime.now().startOf('day').toMillis().toString(),
      end: DateTime.now().endOf('day').toMillis().toString(),
    },
  });
  const [exportPurchasesModalVisible, setExportPurchasesModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onTabClick = (tabName: string) => setActiveTab(tabName);

  const closeExportModal = () => {
    setErrorMessage('');
    setExportPurchasesModalVisible(false);
  };

  const exportOrdersQuery = useExportOrders(
    {
      businessId,
      dateRange: {
        start: range.dateRange.start,
        end: range.dateRange.end,
      },
    },
    {
      // purposely set to false, use refetch to trigger this query
      enabled: false,
      // this allows the export attempt to be retried in case of failure
      // but the modal has to be closed and reopen, its a bug
      cacheTime: 0,
      retry: false,
      onError: (e: any) => {
        const exception = e?.errors[0];
        const code = exception.extensions?.code;
        console.warn(code);
        switch (code) {
          case OrderErrors.ExportEmptyErrorCode:
            setErrorMessage('There is no data to export in the selected date range.');
            break;
          default:
            setErrorMessage('Something went wrong');
            break;
        }
      },
      onSuccess: (data: any) => {
        window.open(data.data.exportOrders.s3Url, '_blank');
        setExportPurchasesModalVisible(false);
        setRange({
          display: 'Today',
          dateRange: {
            start: DateTime.now().startOf('day').toMillis().toString(),
            end: DateTime.now().endOf('day').toMillis().toString(),
          },
        });
      },
    }
  );

  const exportOrdersClicked = () => {
    setErrorMessage('');
    exportOrdersQuery.refetch();
  };

  const parseDateRange = (next: string) => {
    switch (next) {
      case 'Today':
        const dateObj: DateRangeTab = {
          display: 'Today',
          dateRange: {
            start: DateTime.now().startOf('day').toMillis().toString(),
            end: DateTime.now().endOf('day').toMillis().toString(),
          },
        };
        setRange(dateObj);
        break;
      case 'Previous 7 Days':
        const pastWeek: DateRangeTab = {
          display: 'Previous 7 Days',
          dateRange: {
            start: DateTime.now().minus({ weeks: 1 }).startOf('day').toMillis().toString(),
            end: DateTime.now().endOf('day').toMillis().toString(),
          },
        };
        setRange(pastWeek);
        break;
      case 'Current Month':
        const month: DateRangeTab = {
          display: 'Current Month',
          dateRange: {
            start: DateTime.now().startOf('month').toMillis().toString(),
            end: DateTime.now().endOf('day').toMillis().toString(),
          },
        };
        setRange(month);
        break;
      case 'Previous Month':
        const lastMonth: DateRangeTab = {
          display: 'Previous Month',
          dateRange: {
            start: DateTime.now().minus({ months: 1 }).startOf('month').toMillis().toString(),
            end: DateTime.now().minus({ months: 1 }).endOf('month').toMillis().toString(),
          },
        };
        setRange(lastMonth);
        break;
      // case 'All':
      //   const all: DateRangeTab = {
      //     display: 'All',
      //     dateRange: {
      //       start: DateTime.fromMillis(0).toString(),
      //       end: DateTime.now().endOf('day').toMillis().toString(),
      //     },
      //   };
      //   setRange(all);
      //   break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col my-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <CottageTabs tabs={tabs} activeTab={activeTab} onTabClick={onTabClick} />
            <div>
              <Button
                className="flex items-center h-10 sm:w-40 focus:outline-none focus:shadow-none"
                onClick={() => setExportPurchasesModalVisible(true)}
                type="submit"
                colorScheme="cottage-green"
                size="md"
                isFullWidth>
                <label className="hidden text-sm font-semibold md:block">Export Orders</label>
              </Button>
              <EditFormPopover
                isOpen={exportPurchasesModalVisible}
                onClose={closeExportModal}
                title={'Export Orders'}>
                <>
                  <div className="mt-6 font-sans text-darkGreen">
                    <Text lineHeight="17px" fontSize="14px" fontWeight="500">
                      Date Range
                    </Text>
                    <RadioGroup mt={2} onChange={parseDateRange} value={range.display}>
                      <Stack direction="column">
                        <div className="flex items-center gap-2">
                          <Radio
                            id="today"
                            value={'Today'}
                            borderColor="#235C48"
                            colorScheme="cottage-green"></Radio>
                          <label
                            htmlFor="today"
                            className="w-full flex items-center justify-between font-sans text-sm font-medium text-darkGreen">
                            Today{' '}
                            <span className="text-grey font-normal">
                              {DateTime.now().toFormat('LLL dd')}
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            id="previousDays"
                            value={'Previous 7 Days'}
                            borderColor="#235C48"
                            colorScheme="cottage-green"></Radio>
                          <label
                            htmlFor="previousDays"
                            className="w-full flex items-center justify-between font-sans text-sm font-medium text-darkGreen">
                            Previous 7 Days{' '}
                            <span className="text-grey font-normal">
                              {DateTime.now()
                                .minus({ weeks: 1 })
                                .startOf('day')
                                .toFormat('LLL dd') +
                                ' - ' +
                                DateTime.now().endOf('day').toFormat('LLL dd')}
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            id="currentMonth"
                            value={'Current Month'}
                            borderColor="#235C48"
                            colorScheme="cottage-green"></Radio>
                          <label
                            htmlFor="currentMonth"
                            className="w-full flex items-center justify-between font-sans text-sm font-medium text-darkGreen">
                            Current Month{' '}
                            <span className="text-grey font-normal">
                              {DateTime.now().startOf('month').toFormat('LLL dd') +
                                ' - ' +
                                DateTime.now().endOf('day').toFormat('LLL dd')}
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Radio
                            id="previousMonth"
                            value={'Previous Month'}
                            borderColor="#235C48"
                            colorScheme="cottage-green"></Radio>
                          <label
                            htmlFor="previousMonth"
                            className="w-full flex items-center justify-between font-sans text-sm font-medium text-darkGreen">
                            Previous Month{' '}
                            <span className="text-grey font-normal">
                              {DateTime.now()
                                .minus({ months: 1 })
                                .startOf('month')
                                .toFormat('LLL dd') +
                                ' - ' +
                                DateTime.now()
                                  .minus({ months: 1 })
                                  .endOf('month')
                                  .toFormat('LLL dd')}
                            </span>
                          </label>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <Radio
                            id="all"
                            value={'All'}
                            borderColor="#235C48"
                            colorScheme="cottage-green"></Radio>
                          <label
                            htmlFor="all"
                            className="w-full flex items-center justify-between font-sans text-sm font-medium text-darkGreen">
                            All
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Radio
                            id="custom"
                            value={'Custom'}
                            borderColor="#235C48"
                            colorScheme="cottage-green"></Radio>
                          <label
                            htmlFor="custom"
                            className="w-full flex items-center justify-between font-sans text-sm font-medium text-darkGreen">
                            Custom
                          </label>
                        </div> */}
                      </Stack>
                    </RadioGroup>
                  </div>
                  <div className="mt-6 font-sans text-darkGreen">
                    <Text lineHeight="17px" fontSize="14px" fontWeight="500" mb={2}>
                      Columns
                    </Text>
                    <Select
                      variant="outline"
                      iconSize="24px"
                      placeholder="Default (6)"
                      className="font-sans text-sm font-normal">
                      <option value={6}>6 Columns</option>
                      <option value={12}>12 Columns</option>
                      <option value={18}>18 Columns</option>
                    </Select>
                  </div>
                  <Box className="mt-5">
                    <Button
                      colorScheme="cottage-green"
                      height="56px"
                      className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                      type="submit"
                      isLoading={exportOrdersQuery.isLoading}
                      onClick={exportOrdersClicked}>
                      Export
                    </Button>
                    <Button
                      height="36px"
                      className="w-full mt-2 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
                      ref={cancelRef.current}
                      onClick={closeExportModal}>
                      Close
                    </Button>
                    {errorMessage && (
                      <Box mt={4}>
                        <CottageAlert severity={AlertSeverity.ERROR}>{errorMessage}</CottageAlert>
                      </Box>
                    )}
                  </Box>
                </>
              </EditFormPopover>
            </div>
          </div>
          <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
            {activeTab === PurchaseTabName.ORDERS ? <OrdersTable /> : <SubscriptionsTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasesTable;
