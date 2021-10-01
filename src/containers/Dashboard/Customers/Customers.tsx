import { useState } from 'react';
import CustomersHeader from './CustomerHeader';
import CustomersTable from './CustomersTable';

interface ICustomersProps {}

const Customers: React.FC<ICustomersProps> = ({}) => {
  return (
    <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
      <CustomersHeader />
      <CustomersTable />
    </div>
  );
};

export default Customers;
