export const getLocationDeliveriesQueryGql = `query getLocationDeliveries($input: ByIdInput!, $pagination: PaginationInput) {
    getLocation(input: $input) {
      deliveries(pagination: $pagination) {
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
            postalCodes
            minimumTotal {
              amount
              currency {
                symbol
                abbreviation
              }
            }
            fee {
              amount
              currency {
                symbol
                abbreviation
              }
            }
          }
        }
      }
    }
  }`;

export const createDeliveryMutationGql = `mutation createDelivery ($input: CreateDeliveryInput!) {
  createDelivery(input: $input) {
      delivery {
        id
        status
        createdAt
        updatedAt
        postalCodes
        minimumTotal {
          amount
          currency {
            symbol
          }
        }
        fee {
          amount
          currency {
            symbol
          }
        }
      }
  }
}`;  

export const updateDeliveryMutationGql = `mutation updateDelivery ($input: UpdateDeliveryInput!) {
  updateDelivery(input: $input) {
      delivery {
        id
        status
        createdAt
        updatedAt
        postalCodes
        minimumTotal {
          amount
          currency {
            symbol
          }
        }
        fee {
          amount
          currency {
            symbol
          }
        }
      }
  }
}`; 

export const archiveDeliveryMutationGql = `mutation archiveDelivery ($input: ArchiveDeliveryInput!) {
    archiveDelivery(input: $input) {
        delivery {
          id
          status
          createdAt
          updatedAt
          postalCodes
          minimumTotal {
            amount
            currency {
              symbol
            }
          }
          fee {
            amount
            currency {
              symbol
            }
          }

        }
    }
}`;