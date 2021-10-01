import React from 'react';
import { Button } from '@chakra-ui/react';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';

interface ICottagePaginationProps {
  isLoading: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  currentPageIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPageSize: number;
}
const CottagePagination: React.FC<ICottagePaginationProps> = ({
  isLoading,
  onNextPage,
  onPreviousPage,
  currentPageIndex,
  currentPageSize,
  hasNextPage,
  hasPreviousPage,
}) => {
  const numPrevPages = currentPageIndex;
  const startingItemIndex =
    numPrevPages === 0 && currentPageSize === 0 ? 0 : TABLE_PAGINATION_SIZE * numPrevPages + 1;
  const endingItemIndex = Math.max(startingItemIndex + currentPageSize - 1, 0);
  const totalItemsSoFar = numPrevPages * TABLE_PAGINATION_SIZE + currentPageSize;

  return (
    <nav
      className="flex items-center justify-between px-0 py-3 bg-white border-t border-gray-200"
      aria-label="Pagination">
      {isLoading ? (
        <></>
      ) : (
        <>
          <div className="hidden sm:block">
            <p className="text-sm text-darkGreen">
              Showing <span className="font-medium">{startingItemIndex}</span> to{' '}
              <span className="font-medium">{endingItemIndex}</span> of{' '}
              <span className="font-medium">{`${totalItemsSoFar}${hasNextPage ? '+' : ''}`}</span>{' '}
              results
            </p>
          </div>
        </>
      )}
      <div className="flex justify-between flex-1 sm:justify-end">
        <Button
          onClick={onPreviousPage}
          className={hasPreviousPage
            ? "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-softGreen hover:bg-softGreen-100 border border-gray-300 rounded-md focus:outline-none focus:shadow-none"
            : "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-softGreen border border-gray-300 rounded-md focus:outline-none focus:shadow-none"
          }
          disabled={isLoading || !hasPreviousPage}>
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Previous
        </Button>
        <Button
          onClick={onNextPage}
          className={hasNextPage
            ? "relative inline-flex items-center pl-6 pr-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-softGreen hover:bg-softGreen-100 border border-gray-300 rounded-md focus:outline-none focus:shadow-none"
            : "relative inline-flex items-center pl-6 pr-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-softGreen border border-gray-300 rounded-md focus:outline-none focus:shadow-none"
          }
          disabled={isLoading || !hasNextPage}>
          Next
          <ChevronRightIcon className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </nav>
  );
};
export default CottagePagination;