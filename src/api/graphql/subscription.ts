export const cancelSubscriptionMutationGql = ` mutation cancelSubscription($input: CancelSubscriptionInput!) {
    cancelSubscription(input: $input) {
      subscription {
        id
        status
      }
    }
  }
  `;