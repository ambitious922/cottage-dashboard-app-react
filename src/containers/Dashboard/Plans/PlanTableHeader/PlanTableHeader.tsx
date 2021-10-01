export interface IPlanTableHeaderProps {
  totalPlans: number;
  activeTab: string;
}

const PlanTableHeader: React.FC<IPlanTableHeaderProps> = ({ totalPlans, activeTab }) => {
  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {totalPlans} {activeTab.toLowerCase()} {totalPlans === 1 ? 'plan' : 'plans'}
      </div>
    </div>
  );
};

export default PlanTableHeader;
