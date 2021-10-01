import React from 'react';
import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';

interface ISchedulesProps {
  title: string;
  locationTitle: string;
}

const Schedules: React.FC<ISchedulesProps> = ({ title, locationTitle }) => {
  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.SCHEDULES}>
      <div className="text-black-800">Location Schedules</div>
    </LocationDashboardLayout>
  );
};

export default Schedules;
