import { Container } from '@chakra-ui/react';
import { GetPlanInput, PlanStatus } from 'API';
import { GetImagesResult } from 'api/images';
import { useGetPlan, useGetPlanImages } from 'api/query-hooks/plans';
import { AppContext } from 'App';
import ContainerHeader from 'components/Common/ContainerHeader';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { PlanFormValues } from 'types/plan';
import PlanCard from './PlanCard';
import PlanDetailsTable from './PlanDetailsTable';
import { Spinner, SpinnerSize } from 'components/Common/Spinner';

export interface PlanDetailsProps {}

const PlanDetails: React.FC<PlanDetailsProps> = () => {
  const params: { planId: string; subdomain: string } = useParams();
  const history = useHistory();
  const { businessId } = useContext(AppContext);
  const [planCoverImage, setPlanCoverImage] = useState<string | undefined>(undefined); // when this is set, we are done loading the plan

  const { planId, subdomain } = params;

  const planInput: GetPlanInput = {
    businessId,
    planId,
  };

  const getPlanQuery = useGetPlan(planInput);
  const { data } = getPlanQuery;
  const plan: PlanFormValues | null | undefined = data?.data?.getPlan;

  const imageKeys = plan?.images || [];

  const getPlanImages = useGetPlanImages(
    { keys: imageKeys },
    {
      cacheTime: 0,
      enabled: !!plan,
      retry: false,
      onSettled: (data) => {
        const imageMap = data?.data || new Map();
        const imageKeys: string[] = Array.from(imageMap.keys());

        setPlanCoverImage(imageKeys.length > 0 ? imageMap.get(imageKeys[0]) : '');
      },
    }
  );

  if (planCoverImage === undefined) {
    return <div className="h-screen"><Spinner /></div>;
  }

  if (getPlanQuery.isError || !plan || getPlanImages.isError) {
    return <div className="h-screen text-center text-grey pt-12">Something went wrong</div>;
  }

  const isArchived = plan.status === PlanStatus.ARCHIVED;

  const onBackClick = () => history.push(`/business/${subdomain}/plans`);

  return (
    <div className="px-2 py-2 font-sans md:px-7 text-darkGreen">
      <ContainerHeader headerText="Back to Plans" onBackClick={onBackClick} />
      <div className="p-2 md:pt-14 md:pb-0 md:px-10">
        <PlanCard
          plan={plan}
          defaultImageUrl={planCoverImage}
          isGetPlanLoading={getPlanQuery.isLoading}
          isGetPlanFetching={getPlanQuery.isFetching}
        />
        {isArchived && (
          <Container height="fit-content" minW="fit-content" className="w-full max-w-full p-0 mt-7">
            <CottageAlert severity={AlertSeverity.SOFTINFO}>
              <b>
                This plan is archived and is not available for purchase at any of your locations.
              </b>{' '}
              Existing subscribers will be unaffected until you cancel them manually.
            </CottageAlert>
          </Container>
        )}
      </div>
      <PlanDetailsTable planId={planId} />
    </div>
  );
};

export default PlanDetails;
