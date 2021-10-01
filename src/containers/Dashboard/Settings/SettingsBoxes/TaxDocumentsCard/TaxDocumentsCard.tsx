import React from 'react';
import { Stack, Box, Text, List, ListIcon, ListItem } from '@chakra-ui/react';
import { DocumentTextIcon } from '@heroicons/react/outline';

export interface TaxDocumentsBoxProps {}

const showBlankView = true;

const TaxDocumentsCard: React.FC<TaxDocumentsBoxProps> = () => {
  return (
    <Stack direction="row" className="bg-white my-4 p-6 gap-4 rounded-lg">
      <Box style={{ width: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Tax Documents
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          We'll provide you with your tax documents based on the sales you do on Cottage.
        </Text>
      </Box>
      <Box style={{ width: '75%' }}>
        {showBlankView ? (
          <Box className="flex items-center justify-center h-full">
            <Text className="text-sm text-gray-400 mx-2">No tax documents available.</Text>
          </Box>
        ) : (
          <List spacing={3} className="text-sm font-medium text-lightGreen-100">
            <ListItem className="flex justify-between items-center">
              <div className="flex items-center">
                <Text className="text-gray-400 mx-2 inline">2021</Text>
                <ListIcon as={DocumentTextIcon} fontSize="24px" className="ml-2" />
                1099A
              </div>
              <Text
                as="a"
                href="#"
                className="underline"
                onClick={() => {
                  /* TODO: Download File func*/
                }}>
                Download
              </Text>
            </ListItem>
          </List>
        )}
      </Box>
    </Stack>
  );
};

export default TaxDocumentsCard;
