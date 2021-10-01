import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

export interface EditFormPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const EditFormPopover: React.FC<EditFormPopoverProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
      <ModalOverlay />
      <ModalContent color="#102D29" fontFamily="Inter">
        <ModalHeader className="font-sans text-xl font-medium border-b text-darkGreen">
          {title}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="p-2">
          {/* This is the X in the top right of the modal */}
          <ModalCloseButton top="15px" className="focus:outline-none focus:shadow-none" />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFormPopover;
