export const getBusinessPlansQueryGql = `query getBusinessPlans ($input: GetBusinessInput!, $filterInput: FilterPlansInput, $pagination: PaginationInput) {
    getBusiness(input: $input) {
      plans(input: $filterInput, pagination: $pagination) {
        total
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            createdAt
            updatedAt      
            status
            title
            interval
            images
            description
            rules
            price {
              amount
              currency {
                abbreviation
                symbol
              }
            }
            value {
              amount
              currency {
                abbreviation
                symbol
              }
            }
            subscriptions {
                total
            }
          }
        }
      }
    }
  }`;

export const getLocationPlansQueryGql = `query getLocationPlans ($input: ByIdInput!) {
    getLocation(input: $input) {
      plans {
        id
        title
        interval
        images
        description
        locationIds
        price {
          amount
          currency {
            abbreviation
            symbol
          }
        }
        value {
          amount
          currency {
            abbreviation
            symbol
          }
        }
      }
    }
}`;

export const getPlanQueryGql = ` query getPlan($input: GetPlanInput!) {
    getPlan(input: $input) {
      id
      createdAt
      updatedAt
      status
      title
      interval
      images
      description
      rules
      price {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      value {
        amount
        currency {
          abbreviation
          symbol
        }
      }
    }
  }`;

export const getPlanSubscriptionsGql = ` query getPlanSubscriptions($input: GetPlanInput!, $filterInput: FilterSubscriptionsInput, $pagination: PaginationInput) {
  getPlan(input: $input) {
    subscriptions(input: $filterInput, pagination: $pagination) {
      total
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          email
          createdAt
          status
          collection
          currentPeriodStart
          currentPeriodEnd
          consumerId
          location {
            id
            title
          }
        }
      }
    }
  }
}`;

export const getPlanLocationsGql = ` query getPlanLocations($input: GetPlanInput!) {
  getPlan(input: $input) {
    status
    locations {
      id
      title
    }
  }
}`;

export const getPlanLocationsStatisticsGql = `query getPlanLocationsStatistics ($input: GetPlanInput!) {
  getPlan(input: $input) {
    status
    locationStatistics {
      locationId
      activeSubscriptionCount
      pausedSubscriptionCount
    }
  }
}`;

export const updatePlanLocationsGql = ` mutation updatePlanLocations($input: UpdatePlanInput!) {
  updatePlan(input: $input) {
    plan {
      id
      locations {
        id
        title
      }
    }
  }
}`;

export const createPlanMutationGql = ` mutation createPlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      plan {
        id
        createdAt
        updatedAt  
        status
        title
        interval
        images
        description
        rules
        price {
          amount
          currency {
            abbreviation
            symbol
          }
        }
        value {
          amount
          currency {
            abbreviation
            symbol
          }
        }
      }
    }
  }
  `;

export const updatePlanMutationGql = ` mutation updatePlan($input: UpdatePlanInput!) {
    updatePlan(input: $input) {
      plan {
        id
        createdAt
        updatedAt  
        status
        title
        interval
        images
        description
        rules
        price {
          amount
          currency {
            abbreviation
            symbol
          }
        }
        value {
          amount
          currency {
            abbreviation
            symbol
          }
        }
      }
    }
  }
  `;

export const archivePlanMutationGql = ` mutation archivePlan($input: ArchivePlanInput!) {
    archivePlan(input: $input) {
      plan {
        id
        createdAt
        updatedAt  
        status
        title
        interval
        images
        description
        rules
        price {
          amount
          currency {
            abbreviation
            symbol
          }
        }
        value {
          amount
          currency {
            abbreviation
            symbol
          }
        }
      }
    }
  }
  `;
