import { useHistory, useParams } from 'react-router';
import { Params } from 'constants/Routes';
import ProductForm from '../ProductForm';

export interface CreateProductContainerProps {}

const CreateProduct: React.FC<CreateProductContainerProps> = () => {
  const history = useHistory();
  const { subdomain } = useParams<Params>();
  const onBackClick = () => history.push(`/business/${subdomain}/products`);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        color: '#102D29',
      }}>
      <ProductForm />
    </div>
  );
};

export default CreateProduct;
