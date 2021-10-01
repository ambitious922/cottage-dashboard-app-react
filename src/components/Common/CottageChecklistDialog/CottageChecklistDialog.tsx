import {
  Box,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import CottageAlert from '../CottageAlert';
import { AlertSeverity } from '../CottageAlert/CottageAlert';

export type ChecklistItem = {
  id: string;
  title: string;
};

export interface CottageChecklistDialogProps {
  isOpen: boolean;
  errorMessage: string;
  headerText?: string;
  onClose: () => void;
  onSubmit: (selectedValues: ChecklistItem[]) => void;
  primaryButtonText: string;
  allOptions: ChecklistItem[];
  initiallySelectedOptions: string[];
  isLoading?: boolean;
}

const CottageChecklistDialog = ({
  headerText = '',
  errorMessage,
  onClose,
  onSubmit,
  isOpen,
  primaryButtonText,
  initiallySelectedOptions,
  allOptions,
  isLoading = false,
}: CottageChecklistDialogProps) => {
  const [activeSet, setActiveSet] = useState(new Set(initiallySelectedOptions));

  const toggleItem = (item: string) => {
    if (activeSet.has(item)) {
      activeSet.delete(item);
    } else {
      activeSet.add(item);
    }

    // re-render
    setActiveSet(new Set(Array.from(activeSet)));
  };

  const [checkedItems, setCheckedItems] = useState([false, false]);
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="lg">
      <ModalOverlay />
      <ModalContent color="#102D29" fontFamily="Inter">
        <ModalHeader className="font-sans text-xl font-medium border-b text-darkGreen">
          {headerText}
        </ModalHeader>
        <ModalCloseButton top="15px" className="focus:outline-none focus:shadow-none" />
        <ModalBody pb={6}>
          {' '}
          <Stack pl={4} mt={1} spacing={1}>
            <Checkbox
              marginBottom="8px"
              borderColor="#235C48"
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}>
              Make plan automatically available at all locations
            </Checkbox>
            <Text fontSize="12px" fontWeight="600">
              Location
            </Text>
          </Stack>
          <hr style={{ paddingBottom: '5px' }} />
          <Stack pl={4} mt={1} spacing={1}>
            {allOptions.map((option) => (
              <>
                <Checkbox
                  borderColor="#235C48"
                  fontSize="14px"
                  fontWeight="400"
                  value={option.title}
                  onChange={(e) => toggleItem(e.target.value)}
                  isChecked={activeSet.has(option.title)}>
                  {option.title}
                </Checkbox>
                <hr style={{ paddingBottom: '5px', marginTop: '8px', marginLeft: '-16px' }} />
              </>
            ))}
          </Stack>
        </ModalBody>

        <ModalFooter className="block border-t">
          <Button
            height="56px"
            className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
            mr={3}
            isLoading={isLoading}
            onClick={() => onSubmit(allOptions.filter((option) => activeSet.has(option.title)))}>
            {primaryButtonText}
          </Button>
          <Button
            height="36px"
            className="w-full mt-3 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
            onClick={onClose}>
            Cancel
          </Button>
          {!!errorMessage && (
            <Box mt={4}>
              <CottageAlert severity={AlertSeverity.ERROR}>{errorMessage}</CottageAlert>
            </Box>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CottageChecklistDialog;
