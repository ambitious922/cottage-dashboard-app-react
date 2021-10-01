import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  Box,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import CottageAlert from '../CottageAlert';
import { AlertSeverity } from '../CottageAlert/CottageAlert';

export type ConfirmationModalProps = {
  title: string;
  message: string;
  errorMessage: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonText: string;
  cancelButtonText?: string;
};

const CottageConfirmationModal = ({
  title,
  message,
  errorMessage,
  isLoading,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        size="lg"
        isOpen={true}
        leastDestructiveRef={cancelRef.current}
        onClose={onCancel}>
        <AlertDialogOverlay>
          <AlertDialogContent color="#102D29" fontFamily="Inter">
            <AlertDialogHeader className="font-sans text-xl font-medium border-b text-darkGreen">
              {title}
            </AlertDialogHeader>
            <AlertDialogCloseButton top="15px" className="focus:outline-none focus:shadow-none" />

            <AlertDialogBody paddingX="34px" paddingTop="24px" fontSize="14px">
              {message}
            </AlertDialogBody>

            <AlertDialogFooter paddingX="34px" paddingBottom="34px" className="block">
              <Button
                height="56px"
                className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100 focus:shadow-none"
                isLoading={isLoading}
                onClick={onConfirm}>
                {confirmButtonText}
              </Button>
              <Button
                height="36px"
                className="w-full mt-2 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
                ref={cancelRef.current}
                onClick={onCancel}>
                {cancelButtonText}
              </Button>

              {!!errorMessage && (
                <Box mt={4}>
                  <CottageAlert severity={AlertSeverity.ERROR}>{errorMessage}</CottageAlert>
                </Box>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CottageConfirmationModal;
