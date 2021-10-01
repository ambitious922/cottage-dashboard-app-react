import { Button } from '@chakra-ui/react';
import { Params } from 'constants/Routes';
import { useHistory, useParams } from 'react-router';

export default function PlansHeader() {
  const history = useHistory();
  const { subdomain } = useParams<Params>();

  const pushToCreatePlan = () => history.push(`/business/${subdomain}/plans/new`);

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">Plans</h2>
      </div>
      <div className="flex md:ml-4">
        <Button
          fontSize="14px"
          fontWeight="600"
          colorScheme="cottage-green"
          className="focus:shadow-none"
          onClick={pushToCreatePlan}>
          <label className="text-sm">+ Add new plan</label>
        </Button>
      </div>
    </div>
  );
}
