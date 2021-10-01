import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import DietaryTagForm from '../DietaryTagForm';

interface IDietaryTagModalProps {
  isSelect: boolean;
  onSelect?: (tags: string[]) => void;
  tagsToHide?: string[];
}

const CategoryTagModal: React.FC<IDietaryTagModalProps> = ({
  isSelect,
  children,
  onSelect = () => null,
  tagsToHide = [],
}) => {
  const { isOpen, onOpen, onClose: defaultClose } = useDisclosure();
  const [modalHeaderText, setModalHeaderText] = useState('Dietary Tags');

  const onClose = () => {
    defaultClose();
    setModalHeaderText('Dietary Tags');
  };

  const setNewHeader = () => {
    setModalHeaderText('New Dietary Tag');
  };

  const setViewHeader = () => {
    setModalHeaderText('Dietary Tags');
  };

  const setSelectHeader = () => {
    setModalHeaderText('Dietary Tags');
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent color="#102D29" fontFamily="Inter">
          <ModalHeader className="border-b" fontSize="18px" fontWeight="500">{modalHeaderText}</ModalHeader>
          <ModalCloseButton className="focus:outline-none focus:shadow-none mt-2" color="#235C48" />
          <ModalBody paddingY="24px">
            <DietaryTagForm
              tagsToHide={tagsToHide}
              isSelect={isSelect}
              onSelect={onSelect}
              onCancel={onClose}
              setNewHeader={setNewHeader}
              setViewHeader={setViewHeader}
              setSelectHeader={setSelectHeader}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CategoryTagModal;
