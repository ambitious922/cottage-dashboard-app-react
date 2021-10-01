export interface IPlanTableHeaderProps {
  totalPlans: number;
}

const PlanTableHeader: React.FC<IPlanTableHeaderProps> = ({ totalPlans }) => {
  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {totalPlans} published {totalPlans === 1 ? 'plan' : 'plans'}
      </div>
    </div>
  );
};

export default PlanTableHeader;
