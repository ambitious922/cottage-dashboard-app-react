import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Button,
  Portal,
} from '@chakra-ui/react';

export interface ICottageFilterPopoverProps {
  selectedFilterCount: number;
  disabled: boolean;
  handleApply: () => void;
  clearFilters: () => void;
}

const CottageFilterPopover: React.FC<ICottageFilterPopoverProps> = ({
  selectedFilterCount,
  disabled,
  handleApply,
  clearFilters,
  children,
}) => {
  return (
    <Popover>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              className="text-sm font-medium rounded-md bg-softGreen text-lightGreen-100 px-2 py-2 focus:shadow-none"
              style={{ minWidth: '122px', height: '33px' }}>
              + Search filters {selectedFilterCount ? `| ${selectedFilterCount}` : ''}
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              className="font-sans text-darkGreen border-none"
              borderRadius="11px"
              boxShadow="0px 0px 25px -10px grey"
              _focus={{ boxShadow: '0px 0px 25px -10px grey' }}>
              <PopoverArrow />
              <PopoverHeader className="border-none text-base font-medium text-center p-4">
                Search Filters
              </PopoverHeader>
              <PopoverBody className="px-4 pt-1 pb-4">
                <>
                  {children}
                  <div>
                    <Button
                      colorScheme="cottage-green"
                      className="font-sans text-sm font-semibold focus:shadow-none"
                      width="100%"
                      height="36px"
                      disabled={disabled}
                      onClick={() => {
                        handleApply();
                        onClose();
                      }}>
                      Apply filters
                    </Button>
                    <Button
                      colorScheme="cottage-light-green"
                      className="font-sans text-sm font-semibold text-lightGreen-100 mt-2 focus:shadow-none"
                      width="100%"
                      height="36px"
                      mt={2}
                      onClick={() => {
                        clearFilters();
                      }}>
                      Clear filters
                    </Button>
                  </div>
                </>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
};

export default CottageFilterPopover;
