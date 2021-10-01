import React from 'react';
import DashboardRoutes from 'Routes/DashboardRoutes';
import DashboardSideNav from '../DashboardSideNav';

interface IBusinessDashboardProps {}

const BusinessDashboard: React.FC<IBusinessDashboardProps> = ({}) => {
  return (
    <DashboardSideNav>
      <DashboardRoutes />
    </DashboardSideNav>
  );
};

export default BusinessDashboard;
