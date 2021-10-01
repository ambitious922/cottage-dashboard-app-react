import React from 'react';

import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';

interface IProductsProps {}

const Products: React.FC<IProductsProps> = ({}) => {
  return (
    <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
      <ProductsHeader />
      <ProductsTable />
    </div>
  );
};
export default Products;
