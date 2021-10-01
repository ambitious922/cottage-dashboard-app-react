export const createBusinessBankAccountMutationGql = `mutation createBusinessBankAccountMutation ($input: CreateBusinessBankAccountInput!) {
    createBusinessBankAccount (input: $input) {
      bankAccount {
        id
        type
        status
        accountHolderName
        lastFour
        bankName
        routingNumber
      }
    }
  }`;