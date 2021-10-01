import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import React from 'react';

export interface SearchFiltersModalProps {
  onClear: () => void;
  onApply: () => void;
  searchTitle: string;
  isOpen: boolean;
  onClose: () => void;
  clearButtonText?: string
  applyButtonText?: string
}

const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  isOpen,
  onClose,
  searchTitle,
  onClear,
  onApply,
  children,
  clearButtonText = 'Clear Filters',
  applyButtonText = 'Apply Filters'
}) => {
  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader lineHeight="19px" className="font-sans text-base font-medium text-center text-darkGreen">{searchTitle}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <div className="w-full">
            <Button 
              colorScheme="cottage-green" 
              className="font-sans text-sm font-semibold" 
              width="100%"
              height="56px"
              isFullWidth
              onClick={onApply}>
              {applyButtonText}
            </Button>
            <Button 
              colorScheme="cottage-light-green" 
              className="font-sans text-sm font-semibold text-lightGreen-100 mt-2" 
              minWidth="fit-content"
              height="36px"
              mr={2} 
              isFullWidth
              onClick={onClear}>
              {clearButtonText}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchFiltersModal;
