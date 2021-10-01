import React, { useState } from 'react';
import LocationsTable from './LocationsTable';
import LocationForm from 'containers/Onboarding/LocationForm';

interface IOverviewProps {}

const Overview: React.FC<IOverviewProps> = ({}) => {
  const [createLocationVisible, setCreateLocationVisible] = useState(false);

  return (
    <div>
      <LocationsTable showCreateModal={() => setCreateLocationVisible(true)} />
      {createLocationVisible && (
        <div
          className={
            createLocationVisible
              ? 'h-full px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen overflow-auto'
              : 'hidden'
          }>
          <LocationForm onCancel={() => setCreateLocationVisible(false)} />
        </div>
      )}
    </div>
  );
};

export default Overview;
