import React, { FC }  from 'react';
import { useHistory } from "react-router-dom";
import { Box, Button, Text } from '@chakra-ui/react';
import { ExclamationIcon, ArrowLeftIcon } from '@heroicons/react/outline';

const DashboardNotFound: FC = () => {
  let history = useHistory();
  return (
    <Box className="px-4 md:px-16 py-4 md:py-10 font-sans text-darkGreen h-screen">
      <Button
        variant="link"
        fontSize="16px"
        fontWeight="medium"
        className="text-lightGreen-100 focus:shadow-none"
        onClick={() => history.goBack()}>
        <ArrowLeftIcon className="h-6 w-6 mr-4" />
        Go back
      </Button>
      <Box className="bg-lightGrey rounded-lg mx-auto mt-40 pt-14" paddingX="90px" width="580px" height="242px">
        <ExclamationIcon className="w-14 h-14 text-grey mx-auto mb-9" aria-hidden="true" />
        <Text fontSize="21px" fontWeight="500" className="text-grey text-center w-full">
          Sorry. something went wrong and we couldn't load the requested page.
        </Text>
      </Box>
    </Box>
  );
}

export default DashboardNotFound;
