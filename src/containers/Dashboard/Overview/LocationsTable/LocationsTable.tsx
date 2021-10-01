import React, { useContext } from 'react';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';
import { useGetBusinessLocationsOverview } from 'api/query-hooks/business';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Text } from '@chakra-ui/react';
import { Params } from 'constants/Routes';
import LocationsTableHeader from '../LocationsTableHeader';
import { displayableMonetaryValue } from 'utils';
import { DateTime } from 'luxon';
import { LocationFulfillment } from 'API';

interface ILocationsTableProps {
  showCreateModal: () => void;
}

const startEpochTime = DateTime.now().startOf('day').toMillis();
const endEpochTime = DateTime.now().plus({ days: 7 }).startOf('day').toMillis();

const LocationsTable: React.FC<ILocationsTableProps> = ({ showCreateModal }) => {
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const history = useHistory();

  const businessLocationsOverviewQuery = useGetBusinessLocationsOverview(
    { businessId },
    {
      dateRange: {
        start: startEpochTime.toString(),
        end: endEpochTime.toString(),
      },
    }
  );

  const locations =
    businessLocationsOverviewQuery.data?.data?.getBusiness?.locations?.edges.map((e) => e.node) ||
    [];

  const displayTodaysFulfillment = (fulfillment: LocationFulfillment | null | undefined) => {
    if (!fulfillment || !fulfillment.purchaseCount || !fulfillment.completeCount) {
      // dont display anything
      return <></>;
    }

    return (
      <Text>
        {fulfillment.purchaseCount[0]}
        Green meter should go here
        {fulfillment.completeCount[0]}
      </Text>
    );
  };

  const renderTableBody = () => {
    if (businessLocationsOverviewQuery.isLoading) {
      return (
        <tr>
          <td colSpan={7}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (businessLocationsOverviewQuery.isError) {
      return (
        <tr>
          <td
            colSpan={7}
            className="px-2 py-10 font-sans text-sm font-medium text-center opacity-50 text-darkGray">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (locations.length === 0) {
      return (
        <tr>
          <td
            colSpan={7}
            className="px-2 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            You need to set up an operating location.{' '}
            {
              <Button
                variant="link"
                fontSize="14px"
                fontWeight="400"
                colorScheme="cottage-green"
                className="text-lightGreen-100 mt-4 font-semibold focus:shadow-none"
                onClick={showCreateModal}>
                Create one now.
              </Button>
            }
          </td>
        </tr>
      );
    }

    return locations.map((location) => (
      <tr
        key={location.id}
        className="hover:bg-lightGrey-100 cursor:pointer"
        onClick={() =>
          history.push(`/business/${subdomain}/location/${location.pathSegment}/overview`)
        }>
        <td className="px-2 py-5 text-sm font-semibold text-left">{location.title}</td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">
          {displayTodaysFulfillment(location.fulfillment)}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">
          {displayableMonetaryValue(location.revenue.week)}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">
          {' '}
          {displayableMonetaryValue(location.revenue.month)}
        </td>
        <td className="px-2 py-5 text-sm text-left text-darkGray">
          {' '}
          {displayableMonetaryValue(location.revenue.ytd)}
        </td>
      </tr>
    ));
  };

  return (
    <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
      <LocationsTableHeader />
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Location Name
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Today's Orders
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Revenue 7 days
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Revenue 30 days
            </th>
            <th
              scope="col"
              className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left">
              Revenue YTD
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
    </div>
  );
};

export default LocationsTable;
