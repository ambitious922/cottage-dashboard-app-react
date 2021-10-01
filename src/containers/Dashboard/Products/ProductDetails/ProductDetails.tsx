import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ContainerHeader from 'components/Common/ContainerHeader';
import ProductCard from './ProductCard';

export interface ProductDetailsProps {}

const ProductDetails: React.FC<ProductDetailsProps> = () => {
  const params: { productId: string; subdomain: string } = useParams();
  const history = useHistory();
  const onBackClick = () => history.push(`/business/${params.subdomain}/products`);

  const { productId } = params;

  return (
    <div className="px-2 md:px-7 py-2 font-sans text-darkGreen">
      <ContainerHeader headerText="Back to Products" onBackClick={onBackClick} />
      <div className="p-2 md:pt-14 md:pb-0 md:px-10">
          <ProductCard productId={productId} />
      </div>
    </div>
  );
};

export default ProductDetails;
