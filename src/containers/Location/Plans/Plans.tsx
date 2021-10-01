import { Params } from 'constants/Routes';
import { useHistory, useParams } from 'react-router';
import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';
import PlansTable from './PlansTable';

interface IPlansProps {
  title: string;
  locationTitle: string;
}

const Plans: React.FC<IPlansProps> = ({ title, locationTitle }) => {
  const history = useHistory();
  const { subdomain } = useParams<Params>();

  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.PLANS}
      buttonText={'Manage Plans'}
      buttonAction={() => history.push(`/business/${subdomain}/plans`)}>
      <PlansTable />
    </LocationDashboardLayout>
  );
};

export default Plans;
