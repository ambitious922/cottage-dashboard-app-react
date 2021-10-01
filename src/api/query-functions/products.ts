import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

import {
  businessProductsQueryGql,
  createProductMutationGql,
  createProductTagMutationGql,
  deleteProductTagMutationGql,
  updateProductMutationGql,
  productCategoriesQueryGql,
  productTagsQueryGql,
  archiveProductMutationGql,
  createProductCategoryMutationGql,
  deleteProductCategoryMutationGql,
  getProductQueryGql,
} from 'api/graphql/product';
import { QueryFnProps } from 'models/react-query';
import {
  ArchiveProductInput,
  ArchiveProductMutation,
  businessProductsQuery as APIBusinessProductsQuery,
  CreateProductCategoryInput,
  CreateProductCategoryMutation,
  CreateProductInput,
  CreateProductMutation,
  CreateProductTagInput,
  CreateProductTagMutation,
  DeleteProductCategoryInput,
  DeleteProductCategoryMutation,
  DeleteProductTagInput,
  DeleteProductTagMutation,
  GetBusinessInput,
  getProductQueryVariables,
  productCategoriesQuery as APIProductCategories,
  ProductQuery,
  productTagsQuery as APIProductTags,
  UpdateProductInput,
  UpdateProductMutation,
} from 'API';

export const getProductsFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input, filterInput, pagination] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(businessProductsQueryGql, { input, filterInput, pagination })
  )) as GraphQLResult<APIBusinessProductsQuery>;
  return data;
};

export const createProductFn = async (input: CreateProductInput) => {
  const data = API.graphql(graphqlOperation(createProductMutationGql, { input })) as GraphQLResult<CreateProductMutation>;
  return data;
};

export const updateProductFn = async (input: UpdateProductInput) => {
  const data = API.graphql(graphqlOperation(updateProductMutationGql, { input })) as GraphQLResult<UpdateProductMutation>;
  return data;
};

export const archiveProductFn = async (input: ArchiveProductInput) => {
  const data = API.graphql(graphqlOperation(archiveProductMutationGql, { input })) as GraphQLResult<ArchiveProductMutation>;
  return data;
};

export const getProductCategoriesFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(productCategoriesQueryGql, { input })
  )) as GraphQLResult<APIProductCategories>;
  return data;
};

export const getProductTagsFn = async ({ queryKey }: QueryFnProps<GetBusinessInput>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(productTagsQueryGql, { input })
  )) as GraphQLResult<APIProductTags>;
  return data;
};

export const createProductCategoryFn = async (input: CreateProductCategoryInput) => {
  const data = API.graphql(graphqlOperation(createProductCategoryMutationGql, { input })) as GraphQLResult<CreateProductCategoryMutation>;
  return data;
};

export const deleteProductCategoryFn = async (input: DeleteProductCategoryInput) => {
  const data = API.graphql(graphqlOperation(deleteProductCategoryMutationGql, { input })) as GraphQLResult<DeleteProductCategoryMutation>;
  return data;
};

export const createProductTagFn = async (input: CreateProductTagInput) => {
  const data = API.graphql(graphqlOperation(createProductTagMutationGql, { input })) as GraphQLResult<CreateProductTagMutation>;
  return data;
};

export const deleteProductTagFn = async (input: DeleteProductTagInput) => {
  const data = API.graphql(graphqlOperation(deleteProductTagMutationGql, { input })) as GraphQLResult<DeleteProductTagMutation>;
  return data;
};

export const getProductFn = async ({ queryKey }: QueryFnProps<getProductQueryVariables>) => {
  const [, input] = queryKey;
  const data = (await API.graphql(
    graphqlOperation(getProductQueryGql, { input })
  )) as GraphQLResult<ProductQuery>;
  return data;
};
