import React from 'react';
import LocationDashboardRoutes from 'Routes/LocationDashboardRoutes';
import DashboardSideNav from '../DashboardSideNav';

interface ILocationDashboardProps {}

const LocationDashboard: React.FC<ILocationDashboardProps> = ({}) => {
  return (
    <DashboardSideNav>
      <LocationDashboardRoutes />
    </DashboardSideNav>
  );
};

export default LocationDashboard;
