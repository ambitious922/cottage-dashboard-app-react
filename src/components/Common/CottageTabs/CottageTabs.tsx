import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export interface CottageTab {
  name: string;
  href: string;
  current: boolean;
  count?: number; // TODO: Maybe support a count badge
}

interface CottageTabsProps {
  activeTab: string;
  onTabClick: (tabName: string) => void;
  tabs: CottageTab[];
}

const CottageTabs: React.FC<CottageTabsProps> = ({ tabs, activeTab, onTabClick }) => {
  const selectedIndex = tabs.findIndex((tab) => tab.current) || 0;
  return (
    <Tabs defaultIndex={selectedIndex}>
      <TabList className="border-none">
        {tabs.map((tab) => (
          // TODO: Fix the underline and focus outline
          <Tab
            key={tab.name}
            _selected={{ borderColor: '#102D29', color: '#102D29 !important' }}
            onClick={() => onTabClick(tab.name)}
            className={classNames(
              tab.name === activeTab
                ? 'text-darkGreen'
                : 'border-transparent text-lightGreen-100 hover:border-gray-300',
              'whitespace-nowrap p-0 mr-5 border-b-2 font-medium text-base cursor-pointer focus:shadow-none'
            )}
            aria-current={tab.current ? 'page' : undefined}>
            {tab.name}
            {/* <span className="ml-2">{tab.count}</span>*/}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default CottageTabs;
