import { useState } from 'react';

import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import CustomerDetailsTableTransactions from './CustomerDetailsTableTransactions';
import CustomerDetailsTableSubscriptions from './CustomerDetailsTableSubscriptions';

interface CustomerDetailsTableProps {
  consumerId?: string;
}

export const CustomerDetailTabName = {
  TRANSACTIONS: 'Transactions',
  SUBSCRIPTIONS: 'Subscriptions',
};

const tabs: CottageTab[] = [
  { name: CustomerDetailTabName.TRANSACTIONS, href: '#', current: true, count: 0 },
  { name: CustomerDetailTabName.SUBSCRIPTIONS, href: '#', current: false, count: 0 },
];

const CustomerDetailsTable: React.FC<CustomerDetailsTableProps> = ({ consumerId }) => {
  const [activeTab, setActiveTab] = useState(CustomerDetailTabName.TRANSACTIONS);

  return (
    <div className="px-2 sm:px-10 w-full font-sans" style={{ marginTop: '30px' }}>
      <CottageTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(tabName: string) => setActiveTab(tabName)}
      />
      {activeTab === CustomerDetailTabName.TRANSACTIONS ? (
        <CustomerDetailsTableTransactions consumerId={consumerId} />
      ) : (
        <CustomerDetailsTableSubscriptions consumerId={consumerId} />
      )}
    </div>
  );
};

export default CustomerDetailsTable;
