export const getCouponQueryGql = ` query getCoupon($input: GetCouponInput!) {
  coupon(input: $input) {
    id
    createdAt
    updatedAt
    status
    description
    type
    name
    duration
    minimumTotal {
      amount
      currency {
        abbreviation
        symbol
      }
    }
    amountOff {
      amount
      currency {
        abbreviation
        symbol
      }
    }
    percentOff
  }
}`;

export const getBusinessCouponsQueryGql = `query getBusinessCoupons ($input: GetBusinessInput!, $filterInput: FilterCouponsInput, $pagination: PaginationInput) {
  getBusiness(input: $input) {
    coupons(input: $filterInput, pagination: $pagination) {
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
          type
          name
          duration
          minimumTotal {
            amount
            currency {
              abbreviation
              symbol
            }
          }
          amountOff {
            amount
            currency {
              abbreviation
              symbol
            }
          }
          percentOff
        }
      }
    }
  }
}`;

export const getLocationCouponsQueryGql = `query getLocationCoupons ($input: ByIdInput!) {
  getLocation(input: $input) {
    coupons {
      id
      type
      name
      duration
      locationIds
      minimumTotal {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      amountOff {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      percentOff
    }
  }
}`;

export const getCouponOrdersGql = ` query getCouponOrders($input: GetCouponInput!, $filterInput: DateRangeInput, $pagination: PaginationInput) {
  coupon(input: $input) {
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
          number
          createdAt
          consumer {
            firstName
            lastName
            email
          }
          cost {
            couponAmount {
              amount
              currency {
                abbreviation
                symbol
              }
            }
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
}`

export const getCouponLocationsGql = ` query getCouponLocations($input: GetCouponInput!) {
  coupon(input: $input) {
    status
    locations {
      id
      title
    }
  }
}`

export const createCouponMutationGql = ` mutation createCoupon($input: CreateCouponInput!) {
  createCoupon(input: $input) {
    coupon {
      id
      createdAt
      updatedAt
      status
      type
      name
      duration
      minimumTotal {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      amountOff {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      percentOff
    }
  }
}
`;

export const archiveCouponMutationGql = `mutation archiveCoupon ($input: ArchiveCouponInput!) {
  archiveCoupon(input: $input) {
    coupon {
      id
      status
    }
  }
}`;

export const updateCouponMutationGql = `mutation updateCoupon ($input: UpdateCouponInput!) {
  updateCoupon(input: $input) {
    coupon {
      id
      name
    }
  }
}`;

export const updateCouponLocationsGql = ` mutation updateCouponLocations($input: UpdateCouponInput!) {
  updateCoupon(input: $input) {
    coupon {
      id
      locations {
        id
        title
      }
    }
  }
}`

