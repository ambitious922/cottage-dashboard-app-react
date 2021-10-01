import React, { useContext, useState } from 'react';

import { useHistory, useParams } from 'react-router';
import { AppContext } from 'App';
import LocationNav from './Nav';
import CottageTabs from 'components/Common/CottageTabs';
import { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import { Params } from 'constants/Routes';
import { Button } from '@chakra-ui/react';
import { PencilIcon, PlusIcon, ExternalLinkIcon } from '@heroicons/react/outline';

export enum LocationDashboardRouteNames {
  OVERVIEW = 'Overview',
  ORDERS = 'Orders',
  SCHEDULES = 'Schedules',
  COUPONS = 'Coupons',
  PLANS = 'Plans',
  PICKUP_DELIVERY = 'Pickup and Delivery',
  SETTINGS = 'Settings',
}

interface LocationDashboardLayoutProps {
  title: string;
  locationTitle: string;
  currentTab: LocationDashboardRouteNames;
  buttonText?: string;
  buttonAction?: () => void;
}

const LocationDashboardLayout: React.FC<LocationDashboardLayoutProps> = ({
  title,
  locationTitle,
  children,
  currentTab,
  buttonText,
  buttonAction,
}) => {
  const history = useHistory();
  const { subdomain, pathSegment } = useParams<Params>();
  const { locationId } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(currentTab);

  const locationDashboardTabs: CottageTab[] = [
    { name: LocationDashboardRouteNames.OVERVIEW, href: '/overview', current: false, count: 0 },
    { name: LocationDashboardRouteNames.ORDERS, href: '/orders', current: false, count: 0 },
    { name: LocationDashboardRouteNames.SCHEDULES, href: '/schedules', current: false, count: 0 },
    { name: LocationDashboardRouteNames.COUPONS, href: '/coupons', current: false, count: 0 },
    { name: LocationDashboardRouteNames.PLANS, href: '/plans', current: false, count: 0 },
    {
      name: LocationDashboardRouteNames.PICKUP_DELIVERY,
      href: '/transportation',
      current: false,
      count: 0,
    },
    { name: LocationDashboardRouteNames.SETTINGS, href: '/settings', current: false, count: 0 },
  ];

  const updatedCurrentTab = locationDashboardTabs.find((ldt) => ldt.name === activeTab);

  if (updatedCurrentTab) {
    updatedCurrentTab.current = true;
  }

  const handleTabClick = (tabname: string) => {
    switch (tabname) {
      case LocationDashboardRouteNames.OVERVIEW:
        setActiveTab(LocationDashboardRouteNames.OVERVIEW);
        history.push(`/business/${subdomain}/location/${pathSegment}/overview`, { locationId });
        break;
      case LocationDashboardRouteNames.ORDERS:
        setActiveTab(LocationDashboardRouteNames.ORDERS);
        history.push(`/business/${subdomain}/location/${pathSegment}/orders`, { locationId });
        break;
      case LocationDashboardRouteNames.SCHEDULES:
        setActiveTab(LocationDashboardRouteNames.SCHEDULES);
        history.push(`/business/${subdomain}/location/${pathSegment}/schedules`, { locationId });
        break;
      case LocationDashboardRouteNames.COUPONS:
        setActiveTab(LocationDashboardRouteNames.COUPONS);
        history.push(`/business/${subdomain}/location/${pathSegment}/coupons`, { locationId });
        break;
      case LocationDashboardRouteNames.PLANS:
        setActiveTab(LocationDashboardRouteNames.PLANS);
        history.push(`/business/${subdomain}/location/${pathSegment}/plans`, { locationId });
        break;
      case LocationDashboardRouteNames.PICKUP_DELIVERY:
        setActiveTab(LocationDashboardRouteNames.PICKUP_DELIVERY);
        history.push(`/business/${subdomain}/location/${pathSegment}/transportation/pickup`, {
          locationId,
        });
        break;
      case LocationDashboardRouteNames.SETTINGS:
        setActiveTab(LocationDashboardRouteNames.SETTINGS);
        history.push(`/business/${subdomain}/location/${pathSegment}/settings`, { locationId });
        break;
      default:
        return;
    }
  };

  const renderButtonIcon = () => {
    switch (activeTab) {
      case LocationDashboardRouteNames.COUPONS:
      case LocationDashboardRouteNames.PLANS:
        return <PencilIcon className="w-5 h-5" />;
      case LocationDashboardRouteNames.PICKUP_DELIVERY:
        return <PlusIcon className="w-5 h-5" />;
      case LocationDashboardRouteNames.ORDERS:
        return <ExternalLinkIcon className="w-5 h-5" />;
      default:
        return;
    }
  };

  return (
    <div className="font-sans text-darkGreen">
      {/* TODO rename to LocationHeader */}
      <LocationNav
        locationTitle={locationTitle}
        title={title}
        subdomain={subdomain}
        pathSegment={pathSegment || ''}
      />
      <div className="px-4 md:px-16 py-4 md:py-6 font-sans text-darkGreen">
        <div className="flex items-center justify-between w-full">
          <CottageTabs
            tabs={locationDashboardTabs}
            onTabClick={(tabName: string) => handleTabClick(tabName)}
            activeTab={activeTab}
          />
          {buttonText && buttonAction && (
            <Button
              colorScheme="cottage-green"
              className="text-sm font-semibold focus:shadow-none"
              leftIcon={renderButtonIcon()}
              onClick={buttonAction}>
              {buttonText}
            </Button>
          )}
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
export default LocationDashboardLayout;
