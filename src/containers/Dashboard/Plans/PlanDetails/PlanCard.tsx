import { Box, Button, Container, Stack, Text, Image, useToast } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { ArchivePlanInput, PlanStatus, UpdatePlanInput } from 'API';
import { useArchivePlan, useUpdatePlan } from 'api/query-hooks/plans';
import { AppContext } from 'App';
import { errorToast } from 'components/Common/Toast';
import { Params } from 'constants/Routes';
import { PlanErrors } from 'models/error';
import { useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { PlanFormValues } from 'types/plan';
import { displayableMonetaryValue, displayablePlanInterval } from 'utils';

export interface PlanCardProps {
  plan: PlanFormValues;
  defaultImageUrl?: string;
  isGetPlanLoading: boolean;
  isGetPlanFetching: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  defaultImageUrl,
  isGetPlanLoading,
  isGetPlanFetching,
}) => {
  const history = useHistory();
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const toast = useToast();

  const archivePlanMutation = useArchivePlan();
  const updatePlanMutation = useUpdatePlan();

  const isArchived = plan.status === PlanStatus.ARCHIVED;

  const onEdit = () => history.push(`/business/${subdomain}/plans/${plan.id}/edit`);

  const onArchive = async () => {
    const input: ArchivePlanInput = {
      businessId,
      planId: plan.id,
    };

    await archivePlanMutation.mutateAsync(input);
  };

  const onUnarchive = async () => {
    const input: UpdatePlanInput = {
      businessId,
      planId: plan.id,
      status: PlanStatus.ACTIVE,
    };

    await updatePlanMutation.mutateAsync(input);
  };

  const onSubmit = async () => {
    try {
      return isArchived ? await onUnarchive() : await onArchive();
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case PlanErrors.PlanLimitExceededErrorCode:
          message =
            'Plan limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        case PlanErrors.PlanNotFoundErrorCode:
        case PlanErrors.BusinessNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      errorToast(toast, message);
    }
  };

  return (
    <Stack direction="column" spacing={4}>
      <Box className="w-full py-6 pl-6 pr-6 bg-white rounded-lg shadow-md">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          className="block md:flex">
          <Box>
            <Stack direction="row" spacing={55} alignItems="flex-start" className="block md:flex">
              <Box>
                <Image
                  boxSize="188px"
                  borderRadius="6px"
                  objectFit="cover"
                  src={
                    defaultImageUrl ||
                    'https://cdn.cottage.menu/assets/common/default_food_image.svg'
                  }
                  alt="Plan Sample Image"
                />
              </Box>
              <Box>
                <Text className="mb-3 text-sm font-medium text-grey">Plan Name</Text>
                <Text className="text-base font-semibold text-darkGreen">{plan.title}</Text>
                <Stack direction="row" spacing={85} className="block my-4 md:flex">
                  <Box alignItems="center">
                    {' '}
                    <Text className="mb-3 text-sm font-medium text-grey">Price</Text>
                    <Text className="text-base font-semibold text-darkGreen">
                      {displayableMonetaryValue(plan.price)}
                    </Text>
                  </Box>
                  <Box alignItems="center">
                    {' '}
                    <Text className="mb-3 text-sm font-medium text-grey">Renewal Interval</Text>
                    <Text className="text-base font-semibold text-darkGreen">
                      {displayablePlanInterval(plan.interval)}
                    </Text>
                  </Box>
                  <Box alignItems="center">
                    {' '}
                    <Text className="mb-3 text-sm font-medium text-grey">Value</Text>
                    <Text className="text-base font-semibold text-darkGreen">
                      {displayableMonetaryValue(plan.value)}
                    </Text>
                  </Box>
                </Stack>
                <Container paddingStart={0} minW="xl">
                  <Text className="mb-3 text-sm font-medium text-grey">Description</Text>
                  <Text className="my-3 text-sm font-normal text-darkGray">
                    {plan.description ? plan.description : '-'}
                  </Text>
                </Container>
              </Box>
            </Stack>
          </Box>
          <Box className="mt-4 ml-0 sm:mt-0">
            <Stack direction="column" spacing={2}>
              <Button
                fontSize="14px"
                fontWeight="600"
                className="h-9 text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
                onClick={onEdit}
                minW="161"
                leftIcon={<PencilIcon className="w-4 h-4" />}>
                Edit Details
              </Button>
              <Button
                fontSize="14px"
                fontWeight="600"
                className="h-9 text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none"
                minW="161"
                onClick={onSubmit}
                leftIcon={<TrashIcon className="w-5 h-5" />}
                isLoading={
                  archivePlanMutation.isLoading ||
                  updatePlanMutation.isLoading ||
                  isGetPlanLoading ||
                  isGetPlanFetching
                }>
                {isArchived ? 'Unarchive Plan' : 'Archive Plan'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PlanCard;
