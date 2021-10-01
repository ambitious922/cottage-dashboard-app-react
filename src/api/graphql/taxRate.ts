export const updateTaxRateGql = ` mutation updateTaxRate($input: UpdateTaxRateInput!) {
    updateTaxRate(input: $input) {
       taxRate { 
          id
          rate
          type
          category
       }
    }
}
`