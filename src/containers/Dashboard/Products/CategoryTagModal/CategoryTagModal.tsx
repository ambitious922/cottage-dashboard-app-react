import {
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
import CategoryTagForm from '../CategoryTagForm';

interface IDietaryTagModalProps {
  isSelect: boolean;
  onSelect?: (tags: string[]) => void;
  categoriesToHide?: string[];
}

const CategoryTagModal: React.FC<IDietaryTagModalProps> = ({
  isSelect,
  children,
  categoriesToHide,
  onSelect,
}) => {
  const { isOpen, onOpen, onClose: defaultClose } = useDisclosure();
  const [modalHeaderText, setModalHeaderText] = useState('Categories');
  const onClose = () => {
    defaultClose();
    setModalHeaderText('Categories');
  };

  const setNewHeader = () => {
    setModalHeaderText('New Category');
  };

  const setViewHeader = () => {
    setModalHeaderText('Categories');
  };

  const setSelectHeader = () => {
    setModalHeaderText('Categories');
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
            <CategoryTagForm
              isSelect={isSelect}
              setModalHeaderText={setModalHeaderText}
              onSelect={onSelect}
              onCancel={onClose}
              setNewHeader={setNewHeader}
              setViewHeader={setViewHeader}
              setSelectHeader={setSelectHeader}
              categoriesToHide={categoriesToHide}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CategoryTagModal;
