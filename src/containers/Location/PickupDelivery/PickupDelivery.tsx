import LocationDashboardLayout, { LocationDashboardRouteNames } from '../LocationDashboardLayout';
import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import DeliveryTable from './DeliveryTable';
import PickupTable from './PickupTable';
import EditFormPopover from 'components/Common/EditFormPopover';
import PickupForm from './PickupForm';
import DeliveryForm from './DeliveryForm';

interface IPickupDeliveryProps {
  title: string;
  locationTitle: string;
}

enum ButtonText {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
}

const PickupDelivery: React.FC<IPickupDeliveryProps> = ({ title, locationTitle }) => {
  const params = useParams() as {
    subdomain: string;
    pathSegment: string;
    transportationType: string;
  };
  const { subdomain, pathSegment, transportationType } = params;
  const history = useHistory();

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const [isDelivery, setIsDelivery] = useState(transportationType === 'delivery' ? true : false);

  return (
    <LocationDashboardLayout
      title={title}
      locationTitle={locationTitle}
      currentTab={LocationDashboardRouteNames.PICKUP_DELIVERY}
      buttonText={transportationType === 'delivery' ? 'Create Delivery' : 'Create Pickup Location'}
      buttonAction={
        transportationType === 'delivery'
          ? () => setShowDeliveryModal(true)
          : () => setShowPickupModal(true)
      }>
      <div className="p-4 pb-0 mt-4 bg-white border-b border-gray-200 rounded-lg shadow font-sans text-darkGreen">
        <Button
          className={
            isDelivery
              ? 'text-sm font-medium rounded-md bg-white hover:bg-softGreen text-lightGreen-100 focus:shadow-none mr-1'
              : 'text-sm font-medium rounded-md bg-softGreen text-lightGreen-100 focus:shadow-none mr-1'
          }
          size="sm"
          onClick={() => {
            setIsDelivery(false);
            history.push(`/business/${subdomain}/location/${pathSegment}/transportation/pickup`);
          }}>
          {ButtonText.PICKUP} Locations
        </Button>
        <Button
          className={
            isDelivery
              ? 'text-sm font-medium rounded-md bg-softGreen text-lightGreen-100 focus:shadow-none'
              : 'text-sm font-medium rounded-md bg-white hover:bg-softGreen text-lightGreen-100 focus:shadow-none'
          }
          size="sm"
          onClick={() => {
            setIsDelivery(true);
            history.push(`/business/${subdomain}/location/${pathSegment}/transportation/delivery`);
          }}>
          {ButtonText.DELIVERY} Zones
        </Button>
        <div>
          {transportationType === 'delivery' ? (
            <DeliveryTable showCreateModal={() => setShowDeliveryModal(true)} />
          ) : (
            <PickupTable showCreateModal={() => setShowPickupModal(true)} />
          )}
        </div>
      </div>
      {
        <EditFormPopover
          isOpen={showPickupModal}
          onClose={() => setShowPickupModal(false)}
          title={'Create Pickup Location'}>
          <PickupForm onClose={() => setShowPickupModal(false)} />
        </EditFormPopover>
      }
      {
        <EditFormPopover
          isOpen={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          title={'Create Delivery Rule'}>
          <DeliveryForm onClose={() => setShowDeliveryModal(false)} />
        </EditFormPopover>
      }
    </LocationDashboardLayout>
  );
};

export default PickupDelivery;
