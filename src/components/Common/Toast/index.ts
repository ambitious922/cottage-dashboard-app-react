import { ToastPosition } from '@chakra-ui/react';

export const errorToast = (
  toast: any,
  title: string,
  position?: ToastPosition,
  duration?: number,
  isCloseable?: boolean
) => {
  toast({
    title,
    position: position || 'top',
    status: 'error',
    duration: duration || 10000,
    isClosable: isCloseable || true,
  });
};

export const successToast = (
  toast: any,
  title: string,
  position?: ToastPosition,
  duration?: number,
  isCloseable?: boolean
) => {
  toast({
    title,
    position: position || 'top',
    status: 'success',
    duration: duration || 10000,
    isClosable: isCloseable || true,
  });
};
