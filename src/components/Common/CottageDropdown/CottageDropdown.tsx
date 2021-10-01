import { ChevronDownIcon } from '@heroicons/react/solid';
import { Button, Menu, MenuButton, MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';
import { useState } from 'react';

type mapping<k> = {};
export interface CottageDropdownProps<key> {
  initialValue: string;
  onChange: (value: key) => void;
  items: key[];
  isDisabled?: boolean;
}

const CottageDropdown = <key extends string>({
  initialValue,
  onChange,
  items,
  isDisabled,
}: CottageDropdownProps<key>) => {
  const [activeValue, setActiveValue] = useState(initialValue);

  const onItemClick = (value: key) => {
    setActiveValue(value);
    onChange(value);
  };

  return (
    <Menu matchWidth={true}>
      {({ isOpen }) => (
        <>
          <MenuButton
            className="w-full text-left font-sans text-sm font-normal text-darkGreen bg-white border-lightGreen-100 focus:outline-none focus:shadow-none"
            isDisabled={isDisabled}
            isActive={isOpen}
            as={Button}
            transition="all 0.2s"
            borderWidth="1px"    
            rightIcon={<ChevronDownIcon className="w-5 h-5 text-black" />}>
            {activeValue}
          </MenuButton>
          <style>
            {`
              .custom_menu::before,
              .custom_menu::after
              {
                position: absolute;
                left: calc(50% - 10px);
                top: -5px;
                width: 0;
                height: 0;
                content: '';
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid #ffffff;
              }
              .custom_menu:before {
                border-bottom-color: inherit;
                margin-left: 0px;
                margin-top: -1px;
            }
            `}
          </style>
          <MenuList
            className="p-1 mt-1 rounded-lg custom_menu" 
            style={{
              color: '#235C48',
              boxShadow: '0px 14px 24px rgba(0, 0, 0, 0.08)',
              minWidth:'185px'
            }}>
            {items.map((item, index) => (
              <>
              <MenuItem className="text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100" onClick={() => onItemClick(item)}>{item}</MenuItem>
              {items.length > index + 1 ? <MenuDivider className="my-1 mx-3"/> : ''}
              </>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default CottageDropdown;
