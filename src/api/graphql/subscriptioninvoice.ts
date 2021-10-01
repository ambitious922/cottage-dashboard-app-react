export const getSubscriptionInvoiceQueryGql = `query getSubscriptionInvoice($input: GetSubscriptionInvoiceInput!) {
  subscriptionInvoice(input: $input) {
    id
    createdAt
    updatedAt
    number
    invoiceStatus
    paymentStatus
    cardLastFour
    cardBrand
    planTitle
    consumerFirstName
    consumerLastName
    consumerEmail
    cost {
      subtotal {
        amount 
        currency {
          abbreviation
          symbol
        }
      }  
      estimatedTax {
        amount 
        currency {
          abbreviation
          symbol
        }
      }          
      serviceFee {
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
    period {
      start
      end
    }
  }
}`;

export const businessSubscriptionInvoicesQueryGql = `query getBusinessSubscriptionInvoices($input: GetBusinessInput!, $filterInput:FilterSubscriptionInvoicesInput, $pagination: PaginationInput) {
    getBusiness(input: $input) {
      subscriptionInvoices(input: $filterInput, pagination: $pagination) {
        total
        pageInfo { 
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            id
            createdAt
            updatedAt
            number
            invoiceStatus
            paymentStatus
            cardLastFour
            planTitle
            consumerFirstName
            consumerLastName
            consumerEmail
            cost {
              total {
                amount 
                currency {
                  abbreviation
                  symbol
                }
              }
            }
            period {
              start
              end
            }
          }
        }
      }
    }
  }`;