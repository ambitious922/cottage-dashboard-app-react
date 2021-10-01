import React, { useContext, useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { Stack, Box, Text, Button, HStack, Divider, Heading } from '@chakra-ui/react';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { MinusCircleIcon } from '@heroicons/react/outline';
import { BusinessLevelType } from 'API';
import {  useField } from 'formik';

const levelTypes = [
  {
    name: 'Cottage Standard',
    value: BusinessLevelType[BusinessLevelType.STANDARD],
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore, molestiae.',
  },
  {
    name: 'Cottage Premium',
    value: BusinessLevelType[BusinessLevelType.PREMIUM],
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, repellat.',
  },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
interface PlanSelectionFragmentProps {
  name: string;
}

const PlanSelectionFragment: React.FC<PlanSelectionFragmentProps> = ({ name }) => {
  const [selected, setSelected] = useState('Standard');
  const [field, ,helpers] = useField(name);
  return (
    <>
      <input type="hidden" name="planType" id="planType" value={selected} />
      <HStack className="grid grid-flow-col grid-cols-2 grid-rows-1 gap-6">
          <Box
              className="rounded-lg h-full cursor-pointer" 
              style={selected == 'Standard' 
                  ? {borderWidth: '3px', borderColor: '#294C3B'} 
                  : {borderWidth: '3px', borderColor: '#E3EDE9'}}
              onClick={() => setSelected('Standard')}
          >
              <HStack 
                  className="flex justify-center items-center px-10 rounded-t-lg" 
                  margin={selected == "Standard" ? "-2px" : "0px"}
                  style={selected == 'Standard' 
                      ? {backgroundColor: '#294C3B', paddingTop: '2rem', paddingBottom: '2rem'} 
                      : {backgroundColor: 'white' , paddingTop: '2rem', paddingBottom: '2rem'}}
              >
                  {selected == 'Standard' ? (
                      <CheckCircleIcon className="h-10 w-10 mr-1" color="white"/>
                  ) : (
                      <MinusCircleIcon className="h-10 w-10 mr-1" color="#E3EDE9"/>
                  )}
                  <Text fontSize="21px" fontWeight="600" style={selected == 'Standard' ? {color: 'white'} : {color: '#294C3B'}}>
                      Cottage Standard
                  </Text>
              </HStack>
              <Stack
                  style={selected == 'Standard' 
                  ? {paddingLeft: '0px', paddingRight: '0px'} 
                  : {paddingLeft: '24px', paddingRight: '24px'}}
              >
                  <Divider 
                      opacity="1"
                      borderBottomWidth="3px"
                      style={selected == 'Standard' 
                      ? {borderColor: '#294C3B'} 
                      : {borderColor: '#E3EDE9'}}
                  />
              </Stack>
              <Stack className="p-6">
                  <Heading fontSize="20px" fontWeight="500" className="text-center font-sans font-medium text-mediumGreen"> 
                      <span style={{fontSize: '28px'}}>3%</span> Per Transaction
                  </Heading>
                  <Text className="text-sm font-medium text-center text-mediumGreen">+ 2.9%+30¢ Stripe™ Payment Fee</Text>
                  <Text className="mt-8 mb-2 text-base font-semibold text-center">What You Get: </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Up to two locations
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Up to five active coupons
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      50 Menu Items
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      3 meal plans
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      One daily schedule
                  </Text>
              </Stack>
          </Box>
          <Box 
              className="rounded-lg h-full cursor-pointer" 
              style={selected == 'Premium' 
                  ? {borderWidth: '3px', borderColor: '#294C3B'} 
                  : {borderWidth: '3px', borderColor: '#E3EDE9'}}
              onClick={() => setSelected('Premium')}
          >
              <HStack 
                  className="flex justify-center items-center px-10 rounded-t-lg" 
                  margin={selected == "Premium" ? "-2px" : "0px"}
                  style={selected == 'Premium' 
                      ? {backgroundColor: '#294C3B', paddingTop: '2rem', paddingBottom: '2rem'} 
                      : {backgroundColor: 'white' , paddingTop: '2rem', paddingBottom: '2rem'}}
                  >
                  {selected == 'Premium' ? (
                      <CheckCircleIcon className="h-10 w-10 mr-1" color="white"/>
                  ) : (
                      <MinusCircleIcon className="h-10 w-10 mr-1" color="#E3EDE9"/>
                  )}
                  <Text fontSize="21px" fontWeight="600" style={selected == 'Premium' ? {color: 'white'} : {color: '#294C3B'}}>
                      Cottage Premium
                  </Text>
              </HStack>
              <Stack
                  style={selected == 'Premium' 
                  ? {paddingLeft: '0px', paddingRight: '0px'} 
                  : {paddingLeft: '24px', paddingRight: '24px'}}
              >
                  <Divider 
                      opacity="1"
                      borderBottomWidth="3px"
                      style={selected == 'Premium' 
                      ? {borderColor: '#294C3B'} 
                      : {borderColor: '#E3EDE9'}}
                  />
              </Stack>
              <Stack className="p-6">
                  <Heading fontSize="20px" fontWeight="500" className="text-center font-sans font-medium text-mediumGreen"> 
                      <span style={{fontSize: '28px'}}>5%</span> Per Transaction
                  </Heading>
                  <Text className="text-sm font-medium text-center text-mediumGreen">+ 2.9%+30¢ Stripe™ Payment Fee</Text>
                  <Text className="mt-8 mb-2 text-base font-semibold text-center">What You Get: </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Up to ten locations
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Unlimited active coupons
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Unlimited menu items
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Unlimited meal plans
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Multiple daily schedules
                  </Text>
                  <Text className="my-1 text-sm font-medium text-center">
                      Self hosted store access
                  </Text>
              </Stack>
          </Box>
      </HStack>
    </>
  );
};
export default PlanSelectionFragment;
