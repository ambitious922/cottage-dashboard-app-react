import { LocationStatus } from "API";
import * as Yup from 'yup';

export const LocationUrlFormValues = {
    locationUrl: '',
    locationStatus: LocationStatus.ACTIVE,
}

export const LocationUrlFormValidation = Yup.object().shape({
    locationStatus: Yup.mixed<LocationStatus>().oneOf(Object.values(LocationStatus)),
    locationUrl: Yup.string().url('Location URL must be in standard encoded format.').required('Every location must have a valid location url.')
});
