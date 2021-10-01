import { LocationDashboardPageRoutes, Params } from 'constants/Routes';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { GraphQLResult } from '@aws-amplify/api';

import Overview from 'containers/Location/Overview';
import Orders from 'containers/Location/Orders';
import Schedules from 'containers/Location/Schedules';
import Coupons from 'containers/Location/Coupons';
import Plans from 'containers/Location/Plans';
import PickupDelivery from 'containers/Location/PickupDelivery';
import Settings from 'containers/Location/Settings';
import { AppContext } from 'App';
import { useContext, useEffect } from 'react';
import { useGetBusinessLocations } from 'api/query-hooks/business';
import { FilterLocationsInput, getBusinessLocationsQuery } from 'API';
import { Spinner, SpinnerSize } from 'components/Common/Spinner';
import { Box } from '@chakra-ui/react';

interface LocationDashboardRouteProps {}

const LocationDashboardRoutes: React.FC<LocationDashboardRouteProps> = () => {
  const appContext = useContext(AppContext);
  const history = useHistory();
  const { subdomain, pathSegment } = useParams<Params>();

  const filterInput: FilterLocationsInput = {
    pathSegment,
  };

  const getBusinessLocationsQuery = useGetBusinessLocations(
    { businessId: appContext.businessId },
    filterInput,
    {
      retry: false,
      onSettled: (data, errors: any) => {
        const locations = data?.data?.getBusiness?.locations?.edges.map((e) => e.node);
        if (locations?.length === 0 || errors) {
          history.push(`/business/${subdomain}/overview`);
          return;
        }

        console.log(pathSegment);
        const location = locations?.find((l) => l.pathSegment === pathSegment);
        if (location) {
          console.log('setting app context');
          appContext.setLocationId(location.id);
        }
      },
    }
  );

  // try to update the location state when the path changes
  useEffect(() => {
    const locationsList =
      getBusinessLocationsQuery.data?.data?.getBusiness?.locations?.edges.map((e) => e.node) || [];
    const location = locationsList.find((l) => l.pathSegment === pathSegment);

    if (location) {
      console.log('setting app context');
      appContext.setLocationId(location.id);
    }
  }, [pathSegment]);

  // TODO Dio this should be in the center of the page
  if (getBusinessLocationsQuery.isLoading) {
    return (
      <Box className="h-screen">
        <Spinner size={SpinnerSize.XLARGE} />
      </Box>
    );
  }

  const locationsList =
    getBusinessLocationsQuery.data?.data?.getBusiness?.locations?.edges.map((e) => e.node) || [];

  const location = locationsList.find((l) => l.id === appContext.locationId);
  if (getBusinessLocationsQuery.isError || locationsList.length === 0 || !location) {
    return <>Something went wrong</>;
  }

  const title =
    getBusinessLocationsQuery.isLoading || getBusinessLocationsQuery.isError
      ? ''
      : getBusinessLocationsQuery.data?.data?.getBusiness?.title || '';

  const locationTitle = location.title || '';
  console.log(title);
  console.log(locationTitle);
  return (
    <Switch>
      <Route
        exact
        path={LocationDashboardPageRoutes.OVERVIEW}
        render={() => <Overview title={title} locationTitle={locationTitle} />}
      />
      <Route
        exact
        path={LocationDashboardPageRoutes.ORDERS}
        render={() => <Orders title={title} locationTitle={locationTitle} />}
      />
      <Route
        exact
        path={LocationDashboardPageRoutes.SCHEDULES}
        render={() => <Schedules title={title} locationTitle={locationTitle} />}
      />
      <Route
        exact
        path={LocationDashboardPageRoutes.COUPONS}
        render={() => <Coupons title={title} locationTitle={locationTitle} />}
      />
      <Route
        exact
        path={LocationDashboardPageRoutes.PLANS}
        render={() => <Plans title={title} locationTitle={locationTitle} />}
      />
      <Route
        exact
        path={LocationDashboardPageRoutes.PICKUP_DELVERY}
        render={() => <PickupDelivery title={title} locationTitle={locationTitle} />}
      />
      <Route
        exact
        path={LocationDashboardPageRoutes.SETTINGS}
        render={() => <Settings title={title} locationTitle={locationTitle} />}
      />
    </Switch>
  );
};
export default LocationDashboardRoutes;
