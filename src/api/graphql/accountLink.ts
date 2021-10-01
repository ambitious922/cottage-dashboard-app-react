export const createAccountLinkGql = /* GraphQL */ `
  mutation CreateAccountLinkMutation($input: CreateAccountLinkInput!) {
    createAccountLink(input: $input) {
      accountLink {
        createdAt
        expiresAt
        url
      }
    }
  }
`;