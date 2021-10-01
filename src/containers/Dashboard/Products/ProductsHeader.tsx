import { Button } from '@chakra-ui/react';
import CategoryTagModal from './CategoryTagModal';
import { Params } from 'constants/Routes';
import { useHistory, useParams } from 'react-router-dom';
import DietaryTagModal from './DietaryTagModal';

export default function CouponsHeader() {
  const history = useHistory();
  const { subdomain } = useParams<Params>();

  const pushToCreateProduct = () => history.push(`/business/${subdomain}/products/new`);

  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">Products</h2>
      </div>
      <div className="flex items-center gap-x-2">
        <DietaryTagModal isSelect={false}>
          <Button
            fontSize="14px"
            fontWeight="600"
            className="text-lightGreen-100 bg-softGreen-200 hover:bg-softGreen-100 focus:shadow-none">
            Edit Dietary Tags
          </Button>
        </DietaryTagModal>
        <CategoryTagModal isSelect={false}>
          {' '}
          <Button
            fontSize="14px"
            fontWeight="600"
            className="text-lightGreen-100 bg-softGreen-200 hover:bg-softGreen-100 focus:shadow-none">
            Edit Categories
          </Button>
        </CategoryTagModal>

        <Button
          fontSize="14px"
          fontWeight="600"
          colorScheme="cottage-green"
          className="focus:shadow-none"
          onClick={() => pushToCreateProduct()}>
          + Add new product
        </Button>
      </div>
    </div>
  );
}
