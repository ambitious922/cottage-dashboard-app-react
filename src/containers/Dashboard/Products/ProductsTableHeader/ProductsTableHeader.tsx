export interface IProductTableHeaderProps {
  totalProducts: number;
  activeTab: string;
}

const ProductTableHeader: React.FC<IProductTableHeaderProps> = ({ totalProducts, activeTab }) => {
  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {totalProducts} {activeTab.toLowerCase()}{' '}
        {totalProducts === 1 ? 'product' : 'products'}
      </div>
    </div>
  );
};

export default ProductTableHeader;
