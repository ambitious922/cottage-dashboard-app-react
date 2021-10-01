import React from 'react';
import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';
import OverviewCard from './OverviewCard';
import OverviewOrdersTable from './OverviewOrdersTable';

interface IOverviewProps {
  title: string;
  locationTitle: string;
}

const Overview: React.FC<IOverviewProps> = ({ title, locationTitle }) => {

  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.OVERVIEW}>
      <OverviewCard />
      <OverviewOrdersTable />
    </LocationDashboardLayout>
  );
};

export default Overview;
