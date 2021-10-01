import { Button } from '@chakra-ui/react';
import { PlusIcon } from '@heroicons/react/solid';
import { Params } from 'constants/Routes';
import { useHistory, useParams } from 'react-router';

const CouponsHeader = () => {
  const history = useHistory();
  const { subdomain } = useParams<Params>();

  const pushToCreateCoupon = () => history.push(`/business/${subdomain}/coupons/new`);

  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">Coupons</h2>
      </div>
      <div className="flex md:ml-4">
        <Button
          fontSize="14px"
          fontWeight="600"
          className="focus:shadow-none"
          colorScheme="cottage-green"
          onClick={pushToCreateCoupon}>
          <label className="text-sm">+ Add new coupon</label>
        </Button>
      </div>
    </div>
  );
};

export default CouponsHeader;
