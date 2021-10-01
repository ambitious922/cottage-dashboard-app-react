import { GetPlanInput } from 'API';
import { GetImagesResult } from 'api/images';
import { useGetPlan, useGetPlanImages } from 'api/query-hooks/plans';
import { AppContext } from 'App';
import ContainerHeader from 'components/Common/ContainerHeader';
import { Spinner } from 'components/Common/Spinner';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { PlanFormValues } from '../CreatePlan/PlanFormFields';
import PlanForm from '../PlanForm';

export interface EditPlanProps {}

const EditPlan: React.FC<EditPlanProps> = () => {
  const params: { planId: string; subdomain: string } = useParams();
  const { planId } = params;
  const { businessId } = useContext(AppContext);
  const [planImages, setPlanImages] = useState<Map<string, string> | undefined>(undefined); // when this is set, we are done loading the plan

  const planInput: GetPlanInput = {
    businessId,
    planId,
  };

  const planQuery = useGetPlan(planInput);
  const { data } = planQuery;

  const plan = data?.data?.getPlan;
  const imageKeys = plan?.images || [];

  const getPlanImages = useGetPlanImages(
    { keys: imageKeys },
    {
      cacheTime: 0,
      enabled: !!plan,
      retry: false,
      onSettled: (data) => {
        setPlanImages(data?.data);
      },
    }
  );

  if (!planImages) {
    return <Spinner />;
  }

  if (planQuery.isError || getPlanImages.isError || !plan) {
    return <div>Something went wrong</div>;
  }

  const planFormValues: PlanFormValues = {
    title: plan.title,
    interval: plan.interval,
    value: plan.value.amount,
    price: plan.price.amount,
    description: plan.description,
    images: planImages,
  };

  return (
    <div
      className="font-sans"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        color: '#102D29',
      }}>
      <PlanForm planId={planId} planFormValues={planFormValues} />
    </div>
  );
};

export default EditPlan;
