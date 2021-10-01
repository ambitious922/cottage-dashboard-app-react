import React, { createContext, Fragment, useState } from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Routes from './Routes/Routes';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';

interface ICottageAppContext {
  businessId: string;
  businessSubdomain: string;
  locationId: string;
  producerId: string;
  setBusinessId: React.Dispatch<React.SetStateAction<string>>;
  setBusinessSubdomain: React.Dispatch<React.SetStateAction<string>>;
  setLocationId: React.Dispatch<React.SetStateAction<string>>;
  setProducerId: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<ICottageAppContext>({
  businessId: '',
  businessSubdomain: '',
  locationId: '',
  producerId: '',
  setBusinessId: () => null,
  setBusinessSubdomain: () => null,
  setLocationId: () => null,
  setProducerId: () => null,
});

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHER_KEY || '');

const App = () => {
  const [businessId, setBusinessId] = useState('');
  const [businessSubdomain, setBusinessSubdomain] = useState('');
  const [locationId, setLocationId] = useState('');
  const [producerId, setProducerId] = useState('');

  return (
    <Elements stripe={stripePromise}>
      <AppContext.Provider
        value={{
          businessId,
          businessSubdomain,
          locationId,
          producerId,
          setBusinessId,
          setBusinessSubdomain,
          setLocationId,
          setProducerId,
        }}>
        <Router>
          <Routes />
        </Router>
      </AppContext.Provider>
    </Elements>
  );
};

export default App;
