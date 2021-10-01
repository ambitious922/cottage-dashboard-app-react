import { TokenResult, Stripe } from '@stripe/stripe-js';
import { CreateBusinessBankAccountInput, BankAccountType, BusinessType } from 'API';
import { API, graphqlOperation } from 'aws-amplify';
import { createBusinessBankAccountMutationGql } from '../graphql/bankAccount';

interface StripeCreateBusinessBankAccountFormData {
    accountHolderName: string;
    accountNumber: number;
    routingNumber: number;
}


export interface StripeCreateBusinessAccountParams {
    stripe: Stripe;
    businessId: string;
    businessType: BusinessType;
    createBusinessBankAccountFormData: StripeCreateBusinessBankAccountFormData;
}

export const createBusinessBankAccountFn = async (input: StripeCreateBusinessAccountParams) => {

    const { createBusinessBankAccountFormData, businessId, businessType, stripe } = input;
    const { accountHolderName, routingNumber, accountNumber } = createBusinessBankAccountFormData;

    const stripeTokenData: TokenResult | undefined = await stripe?.createToken('bank_account' as any, {
        country: 'US',
        currency: 'usd',
        account_holder_name: accountHolderName,
        account_holder_type: businessType,
        routing_number: routingNumber,
        account_number: accountNumber
    } as any);

    if (stripeTokenData?.error) {
        console.log(stripeTokenData.error);
        return { error: stripeTokenData.error};
    }

    const req: CreateBusinessBankAccountInput = {
        businessId,
        tokenId: stripeTokenData?.token.id || ''
    };

    const data = await API.graphql(
        graphqlOperation(createBusinessBankAccountMutationGql, { input: req })
    );

    return data;

}
