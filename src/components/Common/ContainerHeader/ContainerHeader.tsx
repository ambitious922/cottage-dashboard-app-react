import { useHistory } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';

export interface CreateCouponHeaderProps {
  headerText: string;
  onBackClick: () => void;
}

const DashboardContainerHeader: React.FC<CreateCouponHeaderProps> = ({
  headerText,
  onBackClick,
}) => {
  const history = useHistory();

  return (
    <div className="mt-4 md:flex md:items-center md:justify-between cursor-pointer">
      <div
        className="flex-1 min-w-0"
        style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', color: '#102D29' }}
        onClick={onBackClick}>
        <ArrowLeftIcon className="w-6 h-6 mx-2" />
        <h2 className="font-sans text-2xl font-bold leading-7 sm:truncate">
          {headerText}
        </h2>
      </div>
      <div className="flex mt-4 md:mt-0 md:ml-4"></div>
    </div>
  );
};

export default DashboardContainerHeader;
