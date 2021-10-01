import React from 'react';
import FinancialsHeader from './FinancialsHeader';
import FinancialsTable from './FinancialsTable';

interface FinancialsProps { }

const Financials: React.FC<FinancialsProps> = ({ }) => {
  return (
    <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
      <FinancialsHeader />
      <FinancialsTable />
    </div>
  );
};
export default Financials;
