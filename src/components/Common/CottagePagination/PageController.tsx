import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

export interface PageControllerProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PageController: React.FC<PageControllerProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const increment = () => {
    if (currentPage === totalPages) {
      return;
    }
    setCurrentPage((current) => current + 1);
  };
  const decrement = () => {
    if (currentPage === 1) return;
    setCurrentPage((current) => current - 1);
  };
  // TODO: put in actual total pages
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%' }}>
      <ChevronLeftIcon className="w-5 h-5 text-black-500" onClick={decrement} />
      <p className="mx-1">
        Page <span className="text-blue-500">{currentPage}</span> of {totalPages}
      </p>
      <ChevronRightIcon className="w-5 h-5 text-black-500" onClick={increment} />
    </div>
  );
};

export default PageController;
