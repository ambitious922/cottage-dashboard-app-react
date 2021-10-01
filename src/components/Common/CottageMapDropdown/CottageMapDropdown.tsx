import { ChevronDownIcon } from '@heroicons/react/solid';
import { Button, Menu, MenuButton, MenuItem, MenuList, MenuDivider } from '@chakra-ui/react';

type MappedItem<key> = {
  item: key;
  display: string;
};
export interface CottageMapDropdownProps<key> {
  value: MappedItem<key>;
  onChange: (value: MappedItem<key>) => void;
  items: MappedItem<key>[];
  isDisabled?: boolean;
}

const CottageMapDropdown = <key extends Object>({
  value,
  onChange,
  items,
  isDisabled,
}: CottageMapDropdownProps<key>) => {
  const onItemClick = (value: MappedItem<key>) => {
    onChange(value);
  };

  return (
    <Menu matchWidth={true}>
      {({ isOpen }) => (
        <>
          <MenuButton
            className="w-full font-sans text-sm font-normal text-left bg-white text-darkGreen border-lightGreen-100 focus:outline-none focus:shadow-none"
            isDisabled={isDisabled}
            isActive={isOpen}
            as={Button}
            transition="all 0.2s"
            borderWidth="1px"
            rightIcon={<ChevronDownIcon className="w-5 h-5 text-black" />}>
            {value.display}
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
              minWidth: '185px',
            }}>
            {items.map((item, index) => (
              <>
                <MenuItem
                  className="px-3 py-2 text-sm font-medium rounded-md"
                  onClick={() => onItemClick(item)}>
                  {item.display}
                </MenuItem>
                {items.length > index + 1 ? <MenuDivider className="mx-3 my-1" /> : ''}
              </>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default CottageMapDropdown;
