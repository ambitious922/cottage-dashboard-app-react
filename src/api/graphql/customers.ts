export const getCustomersQueryGql = `query getCustomers (
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
          createdAt
          firstName
          lastName
          email
          phoneNumber
          role
        }
      }
    }
  }
}
`