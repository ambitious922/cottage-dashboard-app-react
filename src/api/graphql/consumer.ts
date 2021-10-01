export const getBusinessConsumersQueryGql = `query getBusinessConsumers (
  $input: GetBusinessInput!
  $filters: FilterConsumersInput
  $pagination: PaginationInput
) {
  getBusiness(input: $input) {
    consumers(input: $filters, pagination: $pagination) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          customerId
          status
          createdAt
          firstName
          lastName
          email
          phoneNumber
          role
          creditBalance {
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
}`;

export const getConsumerTransactionsQueryGql = `query getConsumerTransactions (
  $input: GetConsumerInput!
  $filters: FilterTransactionInput
  $pagination: PaginationInput
) {
  getConsumer(input: $input) {
    firstName
    lastName
    transactions(input: $filters, pagination: $pagination) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ... on Credit {
            id
            createdAt
            transactionType
            description
            creditStatus
            cost {
              creditAmount {
                amount
                currency {
                  symbol
                }
              }
            }
            creditBalanceSnapshot {
              amount
              currency {
                symbol
                abbreviation
              }
            }
          }
          ... on Order {
            id
            number
            checkoutId
            locationId
            createdAt
            updatedAt
            transactionType
            checkoutStatus
            orderStatus
            orderType
            note
            schedule {
              orderReadyStart
            }
            creditBalanceSnapshot {
              amount
              currency {
                symbol
                abbreviation
              }
            }
            cost {
              subtotal {
                amount
                currency {
                  symbol
                  abbreviation
                }
              }
              netTotal {
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
              creditAmount {
                amount
                currency {
                  symbol
                  abbreviation
                }
              }
            }
          }
          ... on SubscriptionInvoice {
            id
            number
            createdAt
            updatedAt
            transactionType
            invoiceStatus
            paymentStatus
            creditBalanceSnapshot {
              amount
              currency {
                symbol
                abbreviation
              }
            }
            creditTotal {
              amount
              currency {
                symbol
                abbreviation
              }
            }
            cost {
              subtotal {
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
              # what the customer actually paid ($0 if subscription is paised)
              paymentTotal {
                amount
                currency {
                  symbol
                  abbreviation
                }
              }
            }
          }
          ... on Refund {
            id
            createdAt
            refundStatus
            transactionType
            description
            creditBalanceSnapshot {
              amount
              currency {
                symbol
                abbreviation
              }
            }
            cost {
              paymentTotal {
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
    }
  }
}`;

export const getConsumerSubscriptionsQueryGql = `query getConsumerSubscriptions (
  $input: GetConsumerInput!
  $filters: FilterSubscriptionsInput
  $pagination: PaginationInput
) {
  getConsumer(input: $input) {
    subscriptions(input: $filters, pagination: $pagination) {
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
          currentPeriodStart
          currentPeriodEnd
          collection
          status
          plan {
            title
            interval
            price {
              amount
              currency {
                symbol
                abbreviation
              }
            }
            value {
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
  }
}`;

export const getConsumerQueryGql = `query getConsumer($input: GetConsumerInput!) {
  getConsumer(input: $input) {
    id
    customerId
    status
    createdAt
    firstName
    lastName
    email
    phoneNumber
    role
    businessNote
    creditBalance {
      amount
      currency {
        abbreviation
        symbol
      }
    }
  }
}`;

export const updateConsumerStatusGql = `mutation updateConsumer($input: UpdateConsumerInput!) {
  updateConsumer(input: $input) {
    consumer {
      id
      customerId
      status
    }
  }
}`;

export const updateConsumerNoteGql = `mutation updateConsumerNote ($input: UpdateConsumerInput!) {
  updateConsumer(input: $input) {
    consumer {
      id
      businessNote
    }
  }
}`;
