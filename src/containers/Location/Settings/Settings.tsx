import { AppContext } from 'App';
import React, { useContext } from 'react';
import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';
import LocationArchiveCard from './SettingsBoxes/LocationArchiveCard';
import LocationDetailsCard from './SettingsBoxes/LocationDetailsCard';
import LocationUrlCard from './SettingsBoxes/LocationUrlCard';
import LocationSupportOptionsCard from './SettingsBoxes/LocationSupportOptionsCard';
import { Box } from '@chakra-ui/react';
import { useGetLocationSettingsData } from 'api/query-hooks/location';
import { Spinner, SpinnerSize } from 'components/Common/Spinner';
import LocationTaxCard from './SettingsBoxes/LocationTaxCard';

interface SettingsProps {
  title: string;
  locationTitle: string;
}

const Settings: React.FC<SettingsProps> = ({ title, locationTitle }) => {
  const { locationId } = useContext(AppContext);

  const locationSettingsData = useGetLocationSettingsData({
    id: locationId,
  });

  if (locationSettingsData.isLoading) {
    return (
      <Box className="h-screen">
        <Spinner size={SpinnerSize.XLARGE} />
      </Box>
    );
  }

  if (locationSettingsData.isError || !locationSettingsData.data?.data?.getLocation) {
    // TODO: err handling
    return <>Something went wrong </>;
  }

  const locationData = locationSettingsData.data?.data.getLocation;

  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.SETTINGS}>
      <Box className="mx-auto" maxW="1017px">
        <LocationDetailsCard
          title={locationData.title}
          description={locationData.description}
          status={locationData.status}
        />
        <LocationTaxCard taxRate={locationData.taxRate} />
        <LocationSupportOptionsCard
          supportPhone={locationData.supportPhoneNumber}
          supportEmail={locationData.supportEmail}
        />
        <LocationArchiveCard />
      </Box>
    </LocationDashboardLayout>
  );
};
export default Settings;
