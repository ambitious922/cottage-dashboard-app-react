export const getLocationPickupAddressesQueryGql = `query getLocationPickupAddresses($input: ByIdInput!, $pagination: PaginationInput) {
  getLocation(input: $input) {
    pickupAddresses(pagination: $pagination) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }           
      edges {
        node {
          id
          status
          createdAt
          updatedAt
					street
          street2
          city
          postalCode
          country
          stateOrProvince
          title
        }
      }
    }
  }
}`;

export const createPickupAddressMutationGql = `mutation createPickupAddress ($input: CreatePickupAddressInput!) {
  createPickupAddress(input: $input) {
    address {
      id
      status
      createdAt
      updatedAt
      street
      street2
      city
      postalCode
      country
      stateOrProvince
      title
    }
  }
}`;

export const updatePickupAddressMutationGql = `mutation updatePickupAddress ($input: UpdatePickupAddressInput!) {
  updatePickupAddress(input: $input) {
    address {
      id
      status
      createdAt
      updatedAt
      street
      street2
      city
      postalCode
      country
      stateOrProvince
      title
    }
  }
}`;

export const archivePickupAddressMutationGql = `mutation archivePickupAddress ($input: ArchivePickupAddressInput!) {
  archivePickupAddress(input: $input) {
    address {
      id
      status
    }
  }
}`;