import React from 'react';
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { SettingsTab, SettingsTabNames } from '../Settings';

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

interface SettingsTabsProps {
  tabs: SettingsTab[];
  activeTab: SettingsTabNames;
  onTabClick: (tabName: SettingsTabNames) => void;
}

const SettingTabs: React.FC<SettingsTabsProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <Tabs marginTop="24px">
      <TabList className="border-none">
        {tabs.map((tab) => (
          <Tab
            _selected={{ borderColor: '#102D29', color: '#102D29 !important' }}
            key={tab.name}
            onClick={() => onTabClick(tab.name)}
            className={classNames(
              tab.name === activeTab
                ? 'text-darkGreen'
                : 'border-transparent text-lightGreen-100 hover:border-gray-300',
              'whitespace-nowrap p-0 mr-5 border-b-2 font-medium text-base cursor-pointer focus:shadow-none'
            )}
            aria-current={tab.current ? 'page' : undefined}>
            {tab.name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default SettingTabs;
