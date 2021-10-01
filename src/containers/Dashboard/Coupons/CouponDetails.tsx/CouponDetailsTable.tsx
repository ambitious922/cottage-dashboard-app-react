import { useState } from 'react';

import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import CouponDetailsTableLocationSettings from './CouponDetailsTableLocationSettings';
import CouponDetailsTableOrderHistory from './CouponDetailsTableOrderHistory';

interface CouponDetailsTableProps {
  couponId: string;
}

export const CouponsDetailTabName = {
  ORDER_HISTORY: 'Order History',
  LOCATION_SETTINGS: 'Location Settings',
};

const tabs: CottageTab[] = [
  { name: CouponsDetailTabName.ORDER_HISTORY, href: '#', current: true, count: 0 },
  { name: CouponsDetailTabName.LOCATION_SETTINGS, href: '#', current: false, count: 0 },
];

const CouponDetailsTable: React.FC<CouponDetailsTableProps> = ({ couponId }) => {

  const [activeTab, setActiveTab] = useState(CouponsDetailTabName.ORDER_HISTORY);

  return (
    <div className="px-2 sm:px-10 w-full font-sans" style={{marginTop: '30px'}}>
      <CottageTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(tabName: string) => setActiveTab(tabName)}
      />
      {activeTab === CouponsDetailTabName.ORDER_HISTORY ? (
        <CouponDetailsTableOrderHistory couponId={couponId} />
      ) : (
        <CouponDetailsTableLocationSettings couponId={couponId} />
      )}
    </div>
  );
};

export default CouponDetailsTable;
