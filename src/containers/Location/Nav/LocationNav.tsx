import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon, LinkIcon } from '@heroicons/react/outline';
import { Heading, Divider, Center, Button } from '@chakra-ui/react';
import Link from 'components/Common/Link';

export interface LocationNavProps {
  subdomain: string;
  title: string;
  pathSegment: string;
  locationTitle: string;
}

const COPY_URL_TEXT = 'Copy Url';
const COPIED_URL_TEXT = 'Copied!';

const LocationNav: React.FC<LocationNavProps> = ({
  title,
  locationTitle,
  subdomain,
  pathSegment,
}) => {
  const [copyTextState, setCopyTextState] = useState(COPY_URL_TEXT);

  return (
    <Disclosure as="nav" className="bg-softGreen">
      {({ open }) => (
        <>
          <div className="px-4 md:px-16">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <img
                    className="group-hover:text-green-900 mr-4 flex-shrink-0 h-7 w-7"
                    src="https://cdn.cottage.menu/assets/default_store_avatar.svg"
                  />
                  <p className="text-2xl font-semibold text-mediumGreen">{title}</p>
                </div>
                <Center height="50px" paddingY="12px" paddingX="8px">
                  <Divider orientation="vertical" className="border" borderColor="#294C3B" />
                </Center>
                <div className="flex space-x- justify-center items-center">
                  <p className="text-2xl font-medium text-mediumGreen">{locationTitle}</p>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="flex space-x- mx-2 justify-center items-center text-sm font-medium text-mediumGreen cursor-default">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  {`https://${subdomain}.mycottage.menu/${pathSegment}`}
                </div>
                <div>
                  <Button
                    variant="link"
                    fontSize="14px"
                    fontWeight="400"
                    colorScheme="cottage-green"
                    className="flex space-x- mx-2 justify-center items-center text-sm font-medium text-mediumGreen underline hover:text-cottage-green-300 focus:shadow-none"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://${subdomain}.mycottage.menu/${pathSegment}`
                      );
                      setCopyTextState(COPIED_URL_TEXT);
                    }}>
                    {copyTextState}
                  </Button>
                </div>
                <div className="flex space-x- ml-2 justify-center items-center text-sm font-medium text-mediumGreen underline">
                  <Link to="#">Open My Shop</Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default LocationNav;
