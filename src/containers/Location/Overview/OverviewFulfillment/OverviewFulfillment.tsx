import { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, HStack, Text } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { AppContext } from 'App';
import { useGetLocationFullfillment } from 'api/query-hooks/location';
import { Spinner, SpinnerSize } from 'components/Common/Spinner';

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#E3EDE9',
      titleColor: '#102D29',
      bodyColor: '#102D29',
      footerColor: '#102D29',
      titleAlign: 'center',
      bodyAlign: 'center',
      borderWidth: 1,
      // borderColor: '#102D29',
      xAlign: 'center',
      yAlign: 'bottom',
      displayColors: false,
    },
  },
  interaction: {
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
    },
  },
};

const startEpochTime = DateTime.now().startOf('day').toMillis();
const endEpochTime = DateTime.now().plus({ days: 7 }).startOf('day').toMillis();

interface FulfillmentProps {}

const OverviewFulfillment: React.FC<FulfillmentProps> = () => {
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [purchasedCount, setPurchasedCount] = useState<number[]>([]);
  const [completedCount, setCompletedCount] = useState<number[]>([]);
  const [cancelledCount, setCancelledCount] = useState<number[]>([]);
  const { locationId } = useContext(AppContext);

  useEffect(() => {
    // handling setting the current day of the week;
    const now: DateTime = DateTime.now();
    switch (now.weekday) {
      case 1:
        setWeekdays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
        break;
      case 2:
        setWeekdays(['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday']);
        break;
      case 3:
        setWeekdays(['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday']);
        break;
      case 4:
        setWeekdays(['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']);
        break;
      case 5:
        setWeekdays(['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']);
        break;
      case 6:
        setWeekdays(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
        break;
      default:
        setWeekdays(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
        break;
    }
  }, []);

  const fulfillmentData = useGetLocationFullfillment(
    { id: locationId },
    {
      dateRange: {
        start: startEpochTime.toString(),
        end: endEpochTime.toString(),
      },
    }
  );

  useEffect(() => {
    if (fulfillmentData.data?.data?.getLocation?.fulfillment) {
      setPurchasedCount(fulfillmentData.data.data.getLocation.fulfillment.purchaseCount);
      setCompletedCount(fulfillmentData.data.data.getLocation.fulfillment.completeCount);
      setCancelledCount(fulfillmentData.data.data.getLocation.fulfillment.cancelCount);
    }
  }, [fulfillmentData]);

  if (fulfillmentData.isLoading) {
    return <Spinner size={SpinnerSize.LARGE} />;
  }

  if (fulfillmentData.isError || !fulfillmentData.data?.data?.getLocation) {
    return <>Something went wrong, we're unable to display your orders at this time.</>;
  }

  const BAR_THICKNESS = 16;
  const BAR_BORDER_RADIUS = Number.MAX_VALUE;
  const BORDER_WIDTH = 1;

  const data = {
    labels: weekdays,
    datasets: [
      {
        label: 'Completed',
        data: completedCount,
        backgroundColor: ['#294C3B', '#294C3B', '#294C3B', '#294C3B', '#294C3B', '#294C3B'],
        borderColor: ['#294C3B', '#294C3B', '#294C3B', '#294C3B', '#294C3B', '#294C3B'],
        borderWidth: BORDER_WIDTH,
        barThickness: BAR_THICKNESS,
        borderRadius: BAR_BORDER_RADIUS,
        stack: '0',
      },
      {
        label: 'Purchased',
        data: purchasedCount,
        backgroundColor: ['#D2E3D5', '#D2E3D5', '#D2E3D5', '#D2E3D5', '#D2E3D5', '#D2E3D5'],
        borderColor: ['#D2E3D5', '#D2E3D5', '#D2E3D5', '#D2E3D5', '#D2E3D5', '#D2E3D5'],
        borderWidth: BORDER_WIDTH,
        barThickness: BAR_THICKNESS,
        borderRadius: BAR_BORDER_RADIUS,
        stack: '0',
      },
      {
        label: 'Cancelled',
        data: cancelledCount,
        backgroundColor: ['#EB6237', '#EB6237', '#EB6237', '#EB6237', '#EB6237', '#EB6237'],
        borderColor: ['#EB6237', '#EB6237', '#EB6237', '#EB6237', '#EB6237', '#EB6237'],
        borderWidth: BORDER_WIDTH,
        barThickness: BAR_THICKNESS,
        borderRadius: BAR_BORDER_RADIUS,
        stack: '1',
      },
    ],
  };

  return (
    <Box>
      <HStack className="justify-between items-center mb-4">
        <Text className="text-base font-medium">Weekly Orders</Text>
        <HStack className="justify-between items-center" spacing={8}>
          <HStack className="items-center">
            <Box className="w-4 h-4 bg-softGreen-200 rounded-full"></Box>
            <Text className="text-sm font-medium ml-2">Purchased</Text>
            <Text className="text-sm font-medium ml-2">
              {purchasedCount.length > 0 && purchasedCount.reduce((acc, next) => acc + next)}
            </Text>
          </HStack>
          <HStack className="items-center">
            <Box className="w-4 h-4 bg-mediumGreen rounded-full"></Box>
            <Text className="text-sm font-medium ml-2">Completed</Text>
            <Text className="text-sm font-medium ml-2">
              {completedCount.length > 0 && completedCount.reduce((acc, next) => acc + next)}
            </Text>
          </HStack>
          <HStack className="items-center">
            <Box className="w-4 h-4 bg-softWarn rounded-full"></Box>
            <Text className="text-sm font-medium ml-2">Cancelled</Text>
            <Text className="text-sm font-medium ml-2">
              {cancelledCount.length > 0 && cancelledCount.reduce((acc, next) => acc + next)}
            </Text>
          </HStack>
        </HStack>
      </HStack>
      <Bar data={data} options={options} height={70} />
    </Box>
  );
};

export default OverviewFulfillment;
