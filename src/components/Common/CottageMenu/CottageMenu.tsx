import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { Menu, MenuButton, MenuItem, MenuList, IconButton, MenuDivider } from '@chakra-ui/react';

export type MenuOption = {
  title: string;
  onClick: () => void;
}

export interface CottageMenuProps {
  menuOptions: MenuOption[];
}

const CottageMenu = ({ menuOptions }: CottageMenuProps) => {

  return (
    <Menu>
      <MenuButton
        size="xs"
        className="bg-white hover:bg-white focus:outline-none focus:shadow-none"
        height="20px"
        as={IconButton}
        aria-label="Options"
        transition="all 0.2s"
        icon={<DotsHorizontalIcon />}
      />
      <style>
        {`
          .custom_menu_list::before,
          .custom_menu_list::after
          {
            position: absolute;
            right: 10px;
            top: -5px;
            width: 0;
            height: 0;
            content: '';
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #ffffff;
          }
          .custom_menu_list:before {
            border-bottom-color: inherit;
            margin-left: 0px;
            margin-top: -1px;
          }
        `}
      </style>
      <MenuList className="p-1 mt-1 rounded-lg custom_menu_list"
        style={{
          color: '#235C48',
          boxShadow: '0px 14px 24px rgba(0, 0, 0, 0.08)',
          minWidth:'185px'
        }}
      >
        {
          menuOptions.map((menuOption, index) => (
            <MenuItem className="text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100" onClick={menuOption.onClick}>
              {menuOption.title}
              {menuOptions.length > index + 1 ? <MenuDivider className="my-1 mx-3"/> : ''}
            </MenuItem>
          ))
        }
      </MenuList>
    </Menu >
  );
};

export default CottageMenu;
