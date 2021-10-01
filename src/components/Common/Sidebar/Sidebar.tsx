import { Button, Stack } from '@chakra-ui/react';
import React from 'react';

export interface SidebarProps {
  buttonTitle: string;
  onSubmit: () => void;
  isEnabled: boolean;
  isLoading: boolean;
  onCancel: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isLoading,
  buttonTitle,
  onSubmit,
  isEnabled,
  onCancel,
}) => {
  return (
    <Stack className="mt-5 mb-2 mx-3.5 h-full" direction="column" spacing={4} padding={4}>
      <Button
        type="submit"
        className={
          isEnabled
            ? 'text-sm bg-lightGreen text-white hover:bg-lightGreen-100 focus:outline-none focus:shadow-none'
            : 'bg-lightGrey text-lightGreen-100 text-sm'
        }
        onClick={onSubmit}
        isLoading={isLoading}
        disabled={!isEnabled}>
        {buttonTitle}
      </Button>
      <Button
        className="text-sm bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
        onClick={onCancel}>
        Cancel
      </Button>
    </Stack>
  );
};

export default Sidebar;
