import React, { useState, useContext } from 'react';
import { AppContext } from 'App';
import SettingsTab from './SettingsTabs';
import { Heading, Box } from '@chakra-ui/react';
import { BusinessStatus, BusinessType, CountryCode, StateOrProvince } from 'API';
import { useGetBusinessSettingsData } from 'api/query-hooks/business';
import BusinessDetailsCard from './SettingsBoxes/BusinessDetailsCard';
import BusinessAddressCard from './SettingsBoxes/BusinessAddressCard';
import BusinessPlanCard from './SettingsBoxes/BusinessPlanCard';
import LogoAvatar from './SettingsBoxes/LogoAvatar';
import { Spinner, SpinnerSize } from '../../../components/Common/Spinner/Spinner';
import VerificationCard from './SettingsBoxes/VerificationCard';
import TaxDocumentsCard from './SettingsBoxes/TaxDocumentsCard';
import BankAccountCard from './SettingsBoxes/BankAccountCard';
export interface SettingsTab {
  name: SettingsTabNames;
  href: string;
  current: boolean;
  count: number;
}

export enum SettingsTabNames {
  BUSINESS_DETAILS = 'Business Details',
  ONLINE_SHOP = 'Online Shop',
  PAYMENTS_AND_TAXES = 'Payments and Taxes',
}

const tabs: SettingsTab[] = [
  { name: SettingsTabNames.BUSINESS_DETAILS, href: '#', current: true, count: 0 },
  { name: SettingsTabNames.ONLINE_SHOP, href: '#', current: false, count: 0 },
  { name: SettingsTabNames.PAYMENTS_AND_TAXES, href: '#', current: false, count: 0 },
];

interface ISettingsProps {
  fromBanner?: boolean;
}

const Settings: React.FC<ISettingsProps> = ({ fromBanner }) => {
  const [activeTab, setActiveTab] = useState(
    fromBanner ? SettingsTabNames.PAYMENTS_AND_TAXES : SettingsTabNames.BUSINESS_DETAILS
  );

  const onTabClick = (tabName: SettingsTabNames) => {
    setActiveTab(tabName);
  };

  const { businessId } = useContext(AppContext);

  const businessSettings = useGetBusinessSettingsData({
    businessId,
  });

  if (businessSettings.isLoading) {
    return (
      <Box className="h-screen">
        <Spinner size={SpinnerSize.XLARGE} />
      </Box>
    );
  }

  if (businessSettings.isError || !businessSettings.data?.data?.getBusiness) {
    // TODO: err handling
    return <>Something went wrong </>;
  }

  const business = businessSettings?.data.data?.getBusiness;
  const businessAddress = business?.address;

  const BusinessDetails = () => (
    <>
      <BusinessDetailsCard
        businessName={business?.title || ''}
        businessUrl={`https://${business?.subdomain}.mycottage.com`}
        email={business?.email || ''}
        phoneNumber={business?.phoneNumber || ''}
        status={business?.status || BusinessStatus.DRAFT}
      />
      <BusinessAddressCard
        street={businessAddress?.street || ''}
        street2={businessAddress?.street2 || ''}
        city={businessAddress?.city || ''}
        stateOrProvince={businessAddress?.stateOrProvince || StateOrProvince.AK}
        country={businessAddress?.country || CountryCode.US}
        postalCode={businessAddress?.postalCode || ''}
      />
      <BusinessPlanCard level={business?.level} />
    </>
  );

  const OnlineShop = () => (
    <>
      <LogoAvatar
        currentCoverKey={business?.coverImage || ''}
        currentLogoKey={business?.avatarImage || ''}
      />
    </>
  );

  const Payments = () => (
    <>
      <VerificationCard businessStatus={business?.status || BusinessStatus.DRAFT} />
      <BankAccountCard
        businessType={business?.type || BusinessType.COMPANY}
        accountHolderName={business?.bankAccount?.accountHolderName}
        lastFour={business?.bankAccount?.lastFour}
        routingNumber={business?.bankAccount?.routingNumber}
      />
      <TaxDocumentsCard />
    </>
  );

  return (
    <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
      <Heading className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">Settings</Heading>
      <Box className="mx-auto" maxW="1017px">
        <SettingsTab tabs={tabs} activeTab={activeTab} onTabClick={onTabClick} />
        {activeTab === 'Business Details' && <BusinessDetails />}
        {activeTab === 'Online Shop' && <OnlineShop />}
        {activeTab === 'Payments and Taxes' && <Payments />}
      </Box>
    </div>
  );
};
export default Settings;
