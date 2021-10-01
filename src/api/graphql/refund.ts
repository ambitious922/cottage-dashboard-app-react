export const getRefundQueryGql = `query getRefund($input: GetRefundInput!) {
    refund(input: $input) {
      id
      createdAt
      refundStatus
      transactionType
      description
      creditBalanceSnapshot {
        amount
        currency {
          symbol
        }
      }
      cost {
         paymentTotal{
          amount
          currency {
            symbol
          }
        }
      }
      order {
        id
        number
        cost {
            total {
                amount
                currency {
                  symbol
                  abbreviation
                }
            }
        }
      }
      subscriptionInvoice {
        id
        number
        cost {
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
  }`;

export const createOrderRefundMutationGql = ` mutation createOrderRefund($input: CreateOrderRefundInput!) {
    createOrderRefund(input: $input) {
        refund {
            id
            createdAt
            refundStatus
            transactionType
            description
            order {
              number
            }
            subscriptionInvoice {
              number
            }            
            creditBalanceSnapshot {
                amount
                currency {
                    symbol
                }
            }
            cost {
              paymentTotal {
                amount
                currency {
                  symbol
                }
              }
              serviceFee {
                amount
                currency {
                  symbol
                }
              }              
            }
        }
    }
}`;
