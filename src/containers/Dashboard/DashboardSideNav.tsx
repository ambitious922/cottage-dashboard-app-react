import React, { useState, Fragment, useContext } from 'react';
import {
  Text,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
} from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/solid';
import { PageRoutes, Params } from 'constants/Routes';
import { constructDashboardRoutes } from 'utils';
import { useParams, useLocation, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  MenuIcon,
  XIcon,
  ChartPieIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  BookOpenIcon,
  TagIcon,
  CashIcon,
  UserGroupIcon,
  CogIcon,
  UserIcon,
  ExclamationIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { AppContext } from 'App';
import { useGetProducerBusiness } from 'api/query-hooks/producer';
import Divider from 'components/Common/Divider';
import { Spinner, SpinnerSize } from 'components/Common/Spinner';
import { useGetBusinessLocations } from 'api/query-hooks/business';
import LocationForm from 'containers/Onboarding/LocationForm';
import { BusinessStatus, LocationStatus } from 'API';
import DashboardBanner from './DashboardBanner';
import { signOut } from 'api/auth';

interface IDashboardSideNavProps {}

// Not sure if this is needed, taken from tailwind ui
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const DashboardSideNav: React.FC<IDashboardSideNavProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createLocationVisible, setCreateLocationVisible] = useState(false);
  const { businessId, producerId } = useContext(AppContext);
  const location = useLocation<{ pathname: string }>();
  const { subdomain } = useParams<Params>();
  const history = useHistory();
  const routes = constructDashboardRoutes(subdomain);

  const getProducerBusinessQuery = useGetProducerBusiness({ id: producerId });

  const locations = useGetBusinessLocations({
    businessId,
  });

  if (getProducerBusinessQuery.isLoading || getProducerBusinessQuery.isFetching) {
    return <Spinner size={SpinnerSize.XLARGE} />;
  }

  if (getProducerBusinessQuery.data?.data?.producer?.business?.subdomain !== subdomain) {
    history.push(PageRoutes.NOT_FOUND);
  }

  if (
    getProducerBusinessQuery.isError ||
    !getProducerBusinessQuery.data?.data?.producer?.business
  ) {
    return <>Something went wrong </>;
  }

  const navigation = [
    { name: 'Overview', route: routes.OVERVIEW, icon: ChartPieIcon, current: true },
    { name: 'Purchases', route: routes.PURCHASES, icon: ShoppingBagIcon, current: false },
    { name: 'Products', route: routes.PRODUCTS, icon: DocumentTextIcon, current: false },
    { name: 'Plans', route: routes.PLANS, icon: BookOpenIcon, current: false },
    { name: 'Coupons', route: routes.COUPONS, icon: TagIcon, current: false },
    { name: 'Financials', route: routes.FINANCIALS, icon: CashIcon, current: false },
    { name: 'Customers', route: routes.CUSTOMERS, icon: UserGroupIcon, current: false },
    {
      name: 'Settings',
      route: routes.SETTINGS,
      icon: CogIcon,
      current: false,
      secondaryIcon: ExclamationIcon,
    },
  ];

  const business = getProducerBusinessQuery.data?.data?.producer?.business;
  const producer = getProducerBusinessQuery.data?.data?.producer;

  const onSignoutClick = async () => {
    await signOut();
    history.push(PageRoutes.SIGN_IN);
  };

  return (
    <div className="h-screen overflow-hidden">
      {business?.status === BusinessStatus.DRAFT && <DashboardBanner />}
      <div
        className="flex bg-white"
        style={{
          height: business?.status === BusinessStatus.DRAFT ? 'calc(100vh - 82px)' : '100vh',
        }}>
        {/* Mobile view */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed inset-0 z-40 flex md:hidden"
            open={sidebarOpen}
            onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full">
              <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0">
                  <div className="absolute top-0 right-0 pt-2 -mr-12">
                    <button
                      className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center flex-shrink-0 px-5">
                    <img
                      className="w-auto h-8"
                      src="https://cdn.cottage.menu/assets/dashboard/dashboard_cottage_logo.svg"
                      alt="Logo goes here"
                      onClick={() => {
                        setCreateLocationVisible(false);
                        history.push(`/business/${subdomain}/overview`);
                      }}
                    />
                  </div>
                  <hr
                    className="mx-auto w-8"
                    style={{ marginTop: '9px', border: '2px solid #E9EFED' }}
                  />
                  <nav className="pl-0 pr-2 mt-6 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        onClick={() => setCreateLocationVisible(false)}
                        to={item.route}
                        style={{ fontSize: '13px', color: '#235C48' }}
                        className={classNames(
                          location.pathname.includes(item.route)
                            ? 'bg-navItemActive px-5'
                            : 'px-5 hover:bg-navItemHover hover:text-green-900',
                          'group flex items-center py-2 font-sans font-semibold rounded-r-lg'
                        )}>
                        <item.icon
                          className={classNames(
                            location.pathname.includes(item.route)
                              ? ''
                              : 'group-hover:text-green-900',
                            'mr-4 flex-shrink-0 h-4 w-4'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                        {business?.status === BusinessStatus.DRAFT && item.secondaryIcon && (
                          <item.secondaryIcon
                            className={classNames(
                              location.pathname.includes(item.route)
                                ? ''
                                : 'group-hover:text-green-900',
                              'ml-6 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    ))}
                    <Divider />
                    <Text className="text-green-900 text-center">My Locations</Text>
                    {locations.data?.data?.getBusiness?.locations?.edges.map((edge) => (
                      <div className="pl-5 pr-0 group flex items-center py-2 font-sans font-normal text-xs text-lightGreen-100 overflow-auto">
                        <Link
                          key={edge.node.title}
                          to={{
                            pathname: `/business/${business?.subdomain || ''}/location/${
                              edge.node.pathSegment
                            }/overview`,
                            state: { locationId: edge.node.id },
                          }}>
                          {edge.node.title}
                        </Link>
                      </div>
                    ))}
                  </nav>
                  <div>
                    <hr className="my-2.5 mr-2 border-2 border-lightGreen" />
                  </div>
                  <div
                    style={{ fontSize: '13px' }}
                    className="pl-5 pr-0 group flex items-center py-2 font-sans font-semibold text-lightGreen-100">
                    <img
                      className="group-hover:text-green-900 mr-4 flex-shrink-0 h-4 w-4"
                      src="https://cdn.cottage.menu/assets/default_store_avatar.svg"
                    />
                    My Locations
                    <PlusCircleIcon
                      className="ml-2 w-6 h-6 text-lightGreen"
                      onClick={() => setCreateLocationVisible(true)}
                    />
                  </div>
                  <div className="pl-5 pr-0 group flex items-center py-2 font-sans font-normal text-xs text-lightGreen-100">
                    {locations.data?.data?.getBusiness?.locations?.edges.map((edge) => (
                      <div className="pl-5 pr-0 group flex items-center py-2 font-sans font-normal text-xs text-lightGreen-100 overflow-auto">
                        <Link
                          className={
                            `/business/${business?.subdomain || ''}/location/${
                              edge.node.pathSegment
                            }/overview` === location.pathname
                              ? 'font-semibold'
                              : ''
                          }
                          key={edge.node.title}
                          onClick={() => setCreateLocationVisible(false)}
                          to={{
                            pathname: `/business/${business?.subdomain || ''}/location/${
                              edge.node.pathSegment
                            }/overview`,
                            state: { locationId: edge.node.id },
                          }}>
                          {edge.node.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-10 px-2">
                    <Select
                      className="text-xs font-semibold font-sans text-lightGreen-100 pl-10"
                      placeholder="Richard"
                      style={{ borderRadius: '33px' }}
                      iconColor="#235C48"
                    />
                    <UserIcon
                      className="absolute w-6 h-6 text-lightGreen-100"
                      style={{ left: '20px', top: '8px' }}
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col" style={{ width: '200px' }}>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col flex-1 h-0 bg-white">
              <div className="flex flex-col justify-between pt-5 pb-4 h-full overflow-auto">
                <div>
                  <div className="flex items-center justify-center flex-shrink-0 px-5">
                    <img
                      width="128px"
                      height="35px"
                      className="cursor-pointer"
                      src="https://cdn.cottage.menu/assets/dashboard/dashboard_cottage_logo.svg"
                      alt="Logo goes here"
                      onClick={() => {
                        setCreateLocationVisible(false);
                        history.push(`/business/${subdomain}/overview`);
                      }}
                    />
                  </div>
                  <hr
                    className="mx-auto w-8 border-2 border-lightGreen"
                    style={{ marginTop: '9px' }}
                  />
                  <nav className="flex-1 pl-0 pr-2 mt-6 space-y-1 bg-white">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        onClick={() => setCreateLocationVisible(false)}
                        to={item.route}
                        style={{ fontSize: '13px', color: '#235C48' }}
                        className={classNames(
                          location.pathname.includes(item.route)
                            ? 'bg-navItemActive px-5'
                            : 'px-5 hover:bg-navItemHover hover:text-green-900',
                          'group flex items-center py-2 font-sans font-semibold rounded-r-lg'
                        )}>
                        <item.icon
                          className={classNames(
                            location.pathname.includes(item.route)
                              ? ''
                              : 'group-hover:text-green-900',
                            'mr-4 flex-shrink-0 h-4 w-4'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                        {business?.status === BusinessStatus.DRAFT && item.secondaryIcon && (
                          <item.secondaryIcon
                            className={classNames(
                              location.pathname.includes(item.route)
                                ? ''
                                : 'group-hover:text-green-900',
                              'ml-6 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    ))}
                  </nav>
                  <div>
                    <hr className="my-2.5 mr-2 border-2 border-lightGreen" />
                  </div>
                  <div
                    style={{ fontSize: '13px' }}
                    className="pl-5 pr-0 group flex items-center py-2 font-sans font-semibold text-lightGreen-100">
                    <img
                      className="group-hover:text-green-900 mr-4 flex-shrink-0 h-4 w-4"
                      src="https://cdn.cottage.menu/assets/default_store_avatar.svg"
                    />
                    My Locations
                    <PlusCircleIcon
                      className="ml-2 w-6 h-6 text-lightGreen hover:text-darkGreen-100 cursor-pointer"
                      onClick={() => setCreateLocationVisible(true)}
                    />
                  </div>
                  {locations.data?.data?.getBusiness?.locations?.edges.map((edge) => (
                    <div className="pl-5 pr-0 group flex items-center py-2 font-sans font-normal text-xs text-lightGreen-100 overflow-auto">
                      <Link
                        className={
                          `/business/${business?.subdomain || ''}/location/${
                            edge.node.pathSegment
                          }/overview` === location.pathname
                            ? 'font-semibold'
                            : ''
                        }
                        key={edge.node.title}
                        onClick={() => setCreateLocationVisible(false)}
                        to={{
                          pathname: `/business/${business?.subdomain || ''}/location/${
                            edge.node.pathSegment
                          }/overview`,
                          state: { locationId: edge.node.id },
                        }}>
                        {edge.node.title}
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="px-2 mt-4 mb-16">
                  <div className="relative">
                    <Menu placement="top">
                      <MenuButton
                        className="w-full pl-9 text-left font-sans text-sm font-normal text-darkGreen bg-white border-lightGreen-100 focus:outline-none focus:shadow-none"
                        style={{ borderRadius: '33px' }}
                        as={Button}
                        transition="all 0.2s"
                        borderWidth="1px"
                        rightIcon={<ChevronDownIcon className="w-4 h-4 text-darkGreen" />}>
                        <Text className="text-sm font-semibold text-lightGreen-100">
                          {producer.firstName}
                        </Text>
                      </MenuButton>
                      <style>
                        {`
                          .custom_menu::before,
                          .custom_menu::after
                          {
                            position: absolute;
                            left: calc(50% - 10px);
                            top: 44px;
                            width: 0;
                            height: 0;
                            content: '';
                            border-left: 10px solid transparent;
                            border-right: 10px solid transparent;
                            border-top: 10px solid #ffffff;
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
                        <MenuItem
                          className="font-sans text-sm font-medium text-lightGreen-100"
                          onClick={() => onSignoutClick()}>
                          <LogoutIcon className="w-5 h-5 mr-3" /> Log out
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <UserIcon
                      className="absolute w-5 h-5 text-lightGreen-100"
                      style={{ left: '10px', top: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          <div className="pt-1 pl-1 md:hidden sm:pl-3 sm:pt-3">
            <button
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
            <div className="min-w-full mx-auto bg-off-white min-h-full">
              {createLocationVisible ? (
                <div
                  className={
                    createLocationVisible
                      ? 'h-full px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen overflow-auto'
                      : 'hidden'
                  }>
                  <LocationForm onCancel={() => setCreateLocationVisible(false)} />
                </div>
              ) : (
                <div>{children}</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideNav;
