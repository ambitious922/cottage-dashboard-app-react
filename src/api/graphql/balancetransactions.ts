export const getBusinessBalanceTransactionsQueryGql = `query getBusinessBalanceTransactions ($input: GetBusinessInput!, $filterInput: FilterBalanceTransactionsInput, $pagination: PaginationInput) {
    getBusiness(input: $input) {
      balanceTransactions(input: $filterInput, pagination: $pagination) {
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
            availableOn
            status
            type
            reportingCategory
            source {
              id
              number
              type
            }
            net {
              amount
              currency {
                abbreviation
                symbol
              }
            }
            fee {
              amount
              currency {
                abbreviation
                symbol
              }
            }
            amount {
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
  