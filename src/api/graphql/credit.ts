export const createCreditMutationGql = ` mutation createCredit($input: CreateCreditInput!) {
    createCredit(input: $input) {
        credit {
            id
            createdAt
            creditStatus
            transactionType
            description
            creditBalanceSnapshot {
                amount
                currency {
                    symbol
                }
            }
            cost {
                creditAmount {
                  amount
                  currency {
                    symbol
                  }
                }
            }
        }
    }
}`;
