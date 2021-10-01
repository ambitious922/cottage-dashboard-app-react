export const createLocationMutationGql = `mutation createLocation ($input: CreateLocationInput!) {
  createLocation(input: $input) {
    location {
      id
      createdAt
      updatedAt
      status
      title
      pathSegment
    }
  }
}
`;

export const updateLocationMutationGql = `mutation updateLocation ($input: UpdateLocationInput!) {
  updateLocation(input: $input) {
    location {
      id
      status
    }
  }
}
`;

export const archiveLocationMutationGql = `mutation archiveLocation ($input: ArchiveLocationInput!) {
  archiveLocation(input: $input) {
    location {
      id
      status
    }
  }
}
`;

export const getLocationSettingsQueryGql = `query getLocationSettings ($input: ByIdInput!) {
  getLocation(input: $input) {
      id
      status
      pathSegment
      title
      description
      taxRate {
        id
        type
        rate
        category
      }
      supportEmail
      supportPhoneNumber
      coverImage
      description
      website
  }
}`;

export const getLocationFulfillmentQueryGql = `query getLocationFulfillment ($input: ByIdInput!, $fulfillmentInput: LocationFulfillmentInput) {
  getLocation(input: $input) {
    id
    title
    fulfillment (input: $fulfillmentInput) {
      purchaseCount
      completeCount
      cancelCount
    }
  }
}`;
