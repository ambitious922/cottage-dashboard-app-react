import { useState } from 'react';

import CottageTabs, { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import PlanDetailsTableLocationSettings from './PlanDetailsTableLocationSettings';
import PlanDetailsTableSubscriptions from './PlanDetailsTableSubscriptions';

interface PlanDetailsTableProps {
  planId: string;
}

export const PlansDetailTabName = {
  SUBSCRIPTIONS: 'Subscribers',
  LOCATION_SETTINGS: 'Location Settings',
};

const tabs: CottageTab[] = [
  { name: PlansDetailTabName.SUBSCRIPTIONS, href: '#', current: true, count: 0 },
  { name: PlansDetailTabName.LOCATION_SETTINGS, href: '#', current: false, count: 0 },
];

const PlanDetailsTable: React.FC<PlanDetailsTableProps> = ({ planId }) => {

  const [activeTab, setActiveTab] = useState(PlansDetailTabName.SUBSCRIPTIONS);

  return (
    <div className="px-2 sm:px-10 w-full font-sans" style={{marginTop: '30px'}}>
      <CottageTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(tabName: string) => setActiveTab(tabName)}
      />
      {activeTab === PlansDetailTabName.SUBSCRIPTIONS ? (
        <PlanDetailsTableSubscriptions planId={planId} />
      ) : (
        <PlanDetailsTableLocationSettings planId={planId} />
      )}
    </div>
  );
};

export default PlanDetailsTable;
