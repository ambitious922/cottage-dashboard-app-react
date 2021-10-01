import {
  MutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { QueryKeys } from 'models/react-query';
import {
  PaginationInput,
  GetBusinessInput,
  productCategoriesQuery,
  businessProductsQuery,
  productTagsQuery,
  GetProductInput,
  getProductQuery,
  FilterProductsInput,
} from 'API';
import { GraphQLResult } from '@aws-amplify/api';
import {
  createProductFn,
  getProductsFn,
  archiveProductFn,
  createProductTagFn,
  createProductCategoryFn,
  deleteProductCategoryFn,
  deleteProductTagFn,
  getProductTagsFn,
  getProductCategoriesFn,
  getProductFn,
  updateProductFn,
} from 'api/query-functions/products';
import { getImagesFn, GetImagesInput } from 'api/images';

export const useGetProducts = (
  input: GetBusinessInput,
  filters: FilterProductsInput,
  pagination: PaginationInput,
  options: UseQueryOptions<GraphQLResult<businessProductsQuery>> = {}
) => {
  return useQuery<GraphQLResult<businessProductsQuery>>({
    queryKey: [QueryKeys.BUSINESS_PRODUCTS, input, filters, pagination],
    queryFn: getProductsFn,
    ...options,
  });
};

export const useGetProduct = (
  input: GetProductInput,
  options: UseQueryOptions<GraphQLResult<getProductQuery>> = {}
) => {
  return useQuery<GraphQLResult<getProductQuery>>({
    queryKey: [QueryKeys.PRODUCT, input],
    queryFn: getProductFn,
    ...options,
  });
};

export const useGetProductCategories = (
  input: GetBusinessInput,
  options: UseQueryOptions<GraphQLResult<productCategoriesQuery>> = {}
) => {
  return useQuery<GraphQLResult<productCategoriesQuery>>({
    queryKey: [QueryKeys.PRODUCT_CATEGORY, input],
    queryFn: getProductCategoriesFn,
    ...options,
  });
};

export const useGetProductTags = (
  input: GetBusinessInput,
  options: UseQueryOptions<GraphQLResult<productTagsQuery>> = {}
) => {
  return useQuery<GraphQLResult<productTagsQuery>>({
    queryKey: [QueryKeys.PRODUCT_TAG, input],
    queryFn: getProductTagsFn,
    ...options,
  });
};

export const useCreateProduct = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(createProductFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PRODUCTS);
      queryClient.invalidateQueries(QueryKeys.PRODUCT);
    },
    ...options,
  });
};

export const useArchiveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(archiveProductFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PRODUCTS);
      queryClient.invalidateQueries(QueryKeys.PRODUCT);
    },
  });
};

export const useUpdateProduct = (options: MutationOptions | any = {}) => {
  const queryClient = useQueryClient();
  return useMutation(updateProductFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.BUSINESS_PRODUCTS);
      queryClient.invalidateQueries(QueryKeys.PRODUCT);
    },
    ...options,
  });
};

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(createProductCategoryFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PRODUCT_CATEGORY);
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProductCategoryFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PRODUCT_CATEGORY);
    },
  });
};

export const useCreateProductTag = () => {
  const queryClient = useQueryClient();
  return useMutation(createProductTagFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PRODUCT_TAG);
    },
  });
};

export const useDeleteProductTag = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProductTagFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.PRODUCT_TAG);
    },
  });
};

export const useGetProductImages = (
  input: GetImagesInput,
  options: UseQueryOptions<{ data: Map<string, string> }> = {}
) => {
  return useQuery<{ data: Map<string, string> }>({
    queryKey: [QueryKeys.PRODUCT_IMAGES, input],
    queryFn: getImagesFn,
    ...options,
  });
};
