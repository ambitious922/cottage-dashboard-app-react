import { Params } from 'constants/Routes';
import { useHistory, useParams } from 'react-router';
import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';
import CouponsTable from './CouponsTable';

interface ICouponsProps {
  title: string;
  locationTitle: string;
}

const Coupons: React.FC<ICouponsProps> = ({ title, locationTitle }) => {
  const history = useHistory();
  const { subdomain } = useParams<Params>();

  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.COUPONS}
      buttonText={'Manage Coupons'}
      buttonAction={() => history.push(`/business/${subdomain}/coupons`)}>
      <CouponsTable />
    </LocationDashboardLayout>
  );
};

export default Coupons;
