export const businessProductsQueryGql = `query businessProducts ($input: GetBusinessInput!, $filterInput: FilterProductsInput, $pagination: PaginationInput) {
  getBusiness(input: $input) {
    products(input: $filterInput, pagination: $pagination) {
      total
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          description
          price {
            amount
            currency {
              abbreviation
              symbol
            }
          }
          images
          status
          createdAt
          categories
          tags
          ingredients {
            name
            value
            unit
          }
          nutrition {
            calorie
            carbohydrate
            protein
            fat
          }
        }
      }
    }
  }
}
`;

export const getProductQueryGql = ` query getProduct($input: GetProductInput!) {
  product(input: $input) {
    id
    title
    description
    price {
      amount
      currency {
        abbreviation
        symbol
      }
    }
    images
    status
    createdAt
    categories
    tags
    ingredients {
      name
      value
      unit
    }
    nutrition {
      calorie
      carbohydrate
      protein
      fat
    }
  }
}`


export const createProductMutationGql = `mutation createProduct ($input: CreateProductInput!) {
  createProduct(input: $input) {
    product {
      id
      title
      description
      price {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      images
      status
      createdAt
      categories
      tags
      ingredients {
        name
        value
        unit
      }
      nutrition {
        calorie
        carbohydrate
        protein
        fat
      }
    }
  }
}`;

export const updateProductMutationGql = `mutation updateProduct ($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    product {
      id
      title
      description
      price {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      images
      status
      createdAt
      categories
      tags
      ingredients {
        name
        value
        unit
      }
      nutrition {
        calorie
        carbohydrate
        protein
        fat
      }
    }
  }
}`;

export const archiveProductMutationGql = `mutation archiveProduct ($input: ArchiveProductInput!) {
  archiveProduct(input: $input) {
    product {
      id
      title
      description
      price {
        amount
        currency {
          abbreviation
          symbol
        }
      }
      images
      status
      createdAt
      categories
      tags
      ingredients {
        name
        value
        unit
      }
      nutrition {
        calorie
        carbohydrate
        protein
        fat
      }
    }
  }
}`;

export const productCategoriesQueryGql = `query productCategories ($input: GetBusinessInput!) {
  getBusiness(input: $input) {
    productCategories
  }
}
`;

export const productTagsQueryGql = `query productTags ($input: GetBusinessInput!) {
  getBusiness(input: $input) {
    productTags
  }
}
`;

export const createProductCategoryMutationGql = `mutation createProductCategory ($input: CreateProductCategoryInput!) {
  createProductCategory(input: $input) {
    productCategory
  }
}`;

export const deleteProductCategoryMutationGql = `mutation deleteProductCategory ($input: DeleteProductCategoryInput!) {
  deleteProductCategory(input: $input)
}
`;

export const createProductTagMutationGql = `mutation createProductTag ($input: CreateProductTagInput!) {
  createProductTag(input: $input) {
    productTag
  }
}`;

export const deleteProductTagMutationGql = `mutation deleteProductTag ($input: DeleteProductTagInput!) {
  deleteProductTag(input: $input)
}`;
