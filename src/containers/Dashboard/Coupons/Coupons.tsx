import React from 'react';

import CouponsHeader from './CouponsHeader';
import CouponsTable from './CouponsTable';

interface CouponsProps {}

const Coupons: React.FC<CouponsProps> = ({}) => {
  return (    
    <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
      <CouponsHeader />
      <CouponsTable />
    </div>
  );
};
export default Coupons;

// TODO 7/23
// Edit Coupon
// Archive coupons
// Pagination
// Error handling in query hooks
// Auth
// Review products
