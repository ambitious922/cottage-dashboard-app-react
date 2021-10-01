import React, { useState } from 'react';
import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';
import OrdersTable from './OrdersTable';

interface IOrdersProps {
  title: string;
  locationTitle: string;
}

const Orders: React.FC<IOrdersProps> = ({ title, locationTitle }) => {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.ORDERS}
      buttonText={'Export to CSV'}
      buttonAction={() => setShowExportModal(true)}>
      <OrdersTable />
    </LocationDashboardLayout>
  );
};

export default Orders;
