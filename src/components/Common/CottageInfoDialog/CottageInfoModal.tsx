import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { useRef } from 'react';

export type CottageInfoDialogProps = {
  title: string;
  message: string;
  onClose: () => void;
};

const CottageInfoDialog = ({ title, message, onClose }: CottageInfoDialogProps) => {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        size="sm"
        isOpen={true}
        leastDestructiveRef={cancelRef.current}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent color="#102D29" fontFamily="Inter">
            <AlertDialogHeader className="font-sans text-xl font-medium border-b text-darkGreen">
              {title}
            </AlertDialogHeader>
            <AlertDialogCloseButton top="15px" className="focus:outline-none focus:shadow-none" />

            <AlertDialogBody paddingX="34px" paddingTop="24px" fontSize="14px">
              {message}
            </AlertDialogBody>

            {
              <AlertDialogFooter paddingX="34px" paddingBottom="34px" className="block">
                <Button
                  height="36px"
                  className="w-full font-sans text-sm font-semibold text-white bg-lightGreen hover:bg-lightGreen-100"
                  onClick={onClose}>
                  Close
                </Button>
              </AlertDialogFooter>
            }
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CottageInfoDialog;
