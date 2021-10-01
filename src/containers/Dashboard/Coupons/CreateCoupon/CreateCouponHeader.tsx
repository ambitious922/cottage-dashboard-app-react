import { useHistory, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { Params } from 'constants/Routes';

export interface CreateCouponHeaderProps {}

const CreateCouponHeader: React.FC<CreateCouponHeaderProps> = () => {
  const history = useHistory();
  const { subdomain } = useParams<Params>();
  const onBackClick = () => history.push(`/business/${subdomain}/coupons`);
  return (
    <div className="mt-4 md:flex md:items-center md:justify-between">
      <div
        className="flex-1 min-w-0"
        style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}
        onClick={onBackClick}>
        <ArrowLeftIcon className="w-8 h-8 mx-2" />
        <h2 className="text-2xl font-bold leading-7 text-black-600 sm:text-3xl sm:truncate">
          Back To Coupons
        </h2>
      </div>
      <div className="flex mt-4 md:mt-0 md:ml-4"></div>
    </div>
  );
};

export default CreateCouponHeader;
