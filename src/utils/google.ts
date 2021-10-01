import Geocode from 'react-geocode';
import config from "config/config";

// export const GOOGLE_PLACES_ENDPOINT = {
//     PLACES: `https://maps.googleapis.com/maps/api/js?key=${config.google.PLACES_API_KEY}&libraries=places`,
// };  

Geocode.setApiKey(config.google.PLACES_API_KEY || '');

export const getLatLongFromZip = async (zipcode: string) => {
    console.log('gettingLatLong: ', zipcode);
    const data = await Geocode.fromAddress(zipcode);
    const { lat, lng } = data.results[0].geometry.location;
    console.log(lat, lng);
    return {lat, lng};
  };

export const initializeGooglePlacesAutoComplete = (documentElement: any, callback: any) => {
    // Declare Options For Autocomplete
    const options = {
      types: ['address'],
    }; // To disable any eslint 'google not defined' errors
  
    // Initialize Google Autocomplete
    // @ts-ignore
    /*global google*/ const autocomplete = new google.maps.places.Autocomplete(
      documentElement,
      options
    );
  
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    autocomplete.setFields(['address_components', 'formatted_address']);
  
    // Fire Event when a suggested name is selected
    autocomplete.addListener('place_changed', callback);
  
    return autocomplete;
  };
  