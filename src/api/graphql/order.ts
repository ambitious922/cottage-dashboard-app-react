export const getOrderQueryGql = `query getOrder ($input: GetOrderInput!) {
  order(input: $input) {
    id
    locationId
    createdAt
    updatedAt
    number
    orderStatus
    orderType
    cardLastFour
    cardBrand
    note
    orderItems {
      title
      quantity
      price {
        amount
        currency {
          symbol
          abbreviation
        }
      }
    }
    schedule {
      id
      orderReadyStart
      orderReadyEnd
    }
    consumerAddress {
      street
      street2
      city
      postalCode
      country
      stateOrProvince
    }
    pickupAddress {
      street
      street2
      city
      postalCode
      country
      stateOrProvince
    }
    refunds {
      id
    }
    cost {
      subtotal {
        amount
        currency {
          symbol
          abbreviation
        }
      }
      estimatedTax {
        amount
        currency {
          symbol
          abbreviation
        }
      }
      serviceFee {
        amount
        currency {
          symbol
          abbreviation
        }
      }
      deliveryFee {
        amount
        currency {
          symbol
          abbreviation
        }
      }
      couponAmount {
        amount
        currency {
          symbol
          abbreviation
        }
      }
      creditAmount {
        amount
        currency {
          symbol
          abbreviation
        }
      }
      total {
        amount
        currency {
          symbol
          abbreviation
        }
      }
    }
  }
}
`;

export const getBusinessOrdersQueryGql = `query getBusinessOrders ($input: GetBusinessInput!, $filterInput: FilterOrdersInput, $pagination: PaginationInput) {
    getBusiness(input: $input) {
      orders(input: $filterInput, pagination: $pagination) {
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
              locationId
              createdAt
              updatedAt
              number
              orderType
              orderStatus
              cardLastFour
              planTitle
              note
              schedule {
                id
                orderReadyStart
              }
              consumer {
                firstName
                lastName
                email
              }
              consumerAddress {
                street
                street2
                city
                postalCode
                country
                stateOrProvince
              }
              pickupAddress {
                street
                street2
                city
                postalCode
                country
                stateOrProvince
              }
              cost {
                total {
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

export const getLocationOrdersQueryGql = `query getLocationOrders ($input: ByIdInput!, $filterInput: FilterOrdersInput, $pagination: PaginationInput) {
  getLocation(input: $input) {
    orders(input: $filterInput, pagination: $pagination) {
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
            locationId
            createdAt
            updatedAt
            number
            orderType
            orderStatus
            cardLastFour
            planTitle
            note
            schedule {
              id
              orderReadyStart
            }
            consumer {
              firstName
              lastName
              email
            }
            consumerAddress {
              street
              street2
              city
              postalCode
              country
              stateOrProvince
            }
            pickupAddress {
              street
              street2
              city
              postalCode
              country
              stateOrProvince
            }
            cost {
              total {
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

export const transitionOrderCompleteMutationGql = `mutation transitionOrderComplete ($input: TransitionOrderCompleteInput!) {
  transitionOrderComplete(input: $input) {
    order {
      id
      updatedAt
      orderStatus
    }
  }
}`;

export const transitionOrderLocationCanceledMutationGql = `mutation transitionOrderCanceled ($input: TransitionOrderLocationCanceledInput!) {
  transitionOrderLocationCanceled(input: $input) {
    order {
      id
      updatedAt
      orderStatus
    }
  }
}`;

export const exportOrdersQueryGql = `query exportOrders ($input: ExportOrdersInput!) {
  exportOrders(input: $input) {
    s3Url
    validSeconds
  }
}`;
