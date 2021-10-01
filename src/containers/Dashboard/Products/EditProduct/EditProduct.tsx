import { GetProductInput } from 'API';
import { GetImagesResult } from 'api/images';
import { useGetProduct, useGetProductImages } from 'api/query-hooks/product';
import { AppContext } from 'App';
import { Spinner } from 'components/Common/Spinner';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router';
import ProductForm from '../ProductForm';
import { IProductFormValues } from '../ProductForm/ProductFormField';

export interface EditProductProps {}

const EditProduct: React.FC<EditProductProps> = () => {
  const params: { productId: string; subdomain: string } = useParams();
  const { productId } = params;
  const { businessId } = useContext(AppContext);
  const [productImages, setProductImages] = useState<Map<string, string> | undefined>(undefined); // when this is set, we are done loading the product

  const productInput: GetProductInput = {
    businessId,
    productId,
  };

  const productQuery = useGetProduct(productInput);
  const { data } = productQuery;

  const product = data?.data?.product;

  const imageKeys = product?.images || [];

  const getProductImages = useGetProductImages(
    { keys: imageKeys },
    {
      cacheTime: 0,
      enabled: !!product,
      retry: false,
      onSettled: (data) => {
        setProductImages(data?.data);
      },
    }
  );

  if (!productImages) {
    return <Spinner />;
  }

  if (productQuery.isError || getProductImages.isError || !product) {
    return <div>Something went wrong</div>;
  }

  const productFormValues: IProductFormValues = {
    title: product.title,
    price: product.price.amount,
    description: product.description,
    categories: product.categories,
    tags: product.tags,
    images: productImages,
    ingredients: product.ingredients,
    nutrition: product.nutrition,
  };

  return (
    <div
      className="font-sans"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        color: '#102D29',
      }}>
      <ProductForm productId={productId} product={productFormValues} />
    </div>
  );
};

export default EditProduct;
