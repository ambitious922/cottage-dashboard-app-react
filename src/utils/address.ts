import { Address } from "API";

// TODO: This might change
export const formatAddress = (address: Address) => {
    return `${address.street} ${address.street2}, ${address.city} ${address.postalCode}, ${address.country}`
}