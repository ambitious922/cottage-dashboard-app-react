export const getBusinessQueryGql = `query getBusiness ($input: GetBusinessInput!) {
  getBusiness(input: $input) {
    id
    status
    level
    title
    locations {
      edges {
        node {
          id
          pathSegment
          title
        }
      }
    }
  }
}`;

export const getBusinessLocationsOverviewQueryGql = `query getBusinessLocationsOverview ($input: GetBusinessInput!, $fulfillmentInput: LocationFulfillmentInput) {
  getBusiness(input: $input) {
    title
    locations {
      edges {
        node {
          id
          title
          pathSegment
          status
          fulfillment (input: $fulfillmentInput) {
            purchaseCount
            completeCount
            cancelCount
          }
          revenue {
            week {
              amount
              currency {
                abbreviation
                symbol
              }
            }
            month {
              amount
              currency {
                abbreviation
                symbol
              }
            }
            ytd {
              amount
              currency {
                abbreviation
                symbol
              }
            }
          }
        }
      }
    }
  }
}`;

export const getBusinessLocationsQueryGql = `query getBusinessLocations ($input: GetBusinessInput!, $filterInput: FilterLocationsInput) {
  getBusiness(input: $input) {
    title
    locations(input: $filterInput) {
      edges {
        node {
          id
          title
          status
          pathSegment
        }
      }
    }
  }
}`;

export const getBusinessSettingsQueryGql = `query getBusinessSettingsQuery ($input: GetBusinessInput!) {
  getBusiness(input: $input) {
    id
    email
    title
    phoneNumber
    avatarImage
    status
    type
    level
    subdomain
    address {
      street
      street2
      city
      postalCode
      country
      stateOrProvince
    }
    coverImage
    bankAccount {
      id
      status
      type
      accountHolderName
      bankName
      lastFour
      routingNumber
    }
  }
}`;

export const createBusinessMutationGql = `mutation createBusiness ($input: CreateBusinessInput!) {
  createBusiness(input: $input) {
    business {
      id
      status
      subdomain
    }
  }
}`;

export const updateBusinessSettingsMutationGql = `mutation updateBusinessSettings ($input: UpdateBusinessInput!) {
  updateBusiness(input: $input) {
    business {
      type
      id
      updatedAt
    }
  }
}`;

export const updateBusinessAddressMutationGql = `mutation updateBusinessAddress ($input: UpdateBusinessInput!) {
  updateBusiness(input: $input) {
    business {
      id
      address {
        city
        street
        street2
        postalCode
        stateOrProvince
        country
      }
    }
  }
}`;

export const createBusinessBankAccountMutationGql = `mutation createBusinessBankAccount ($input: CreateBusinessBankAccountInput!) {
  createBusinessBankAccount(input: $input) {
    bankAccount {
      id
      type
      accountHolderName
      lastFour
      bankName
      routingNumber
    }
  }
}
`;
