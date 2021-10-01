import PlanForm from '../PlanForm';

export interface CreatePlanContainerProps { }

const CreatePlan: React.FC<CreatePlanContainerProps> = () => {
  return (
    <div className="font-sans" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, padding: 0, color: '#102D29' }}>
      <PlanForm />          
    </div>
  );
};

export default CreatePlan;
