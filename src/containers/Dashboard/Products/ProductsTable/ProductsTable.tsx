import React, { useContext, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';
import {
  businessProductsQuery,
  FilterProductsInput,
  Ingredient,
  MonetaryValue,
  Nutrition,
  PaginationInput,
  ProductStatus,
} from 'API';
import { useArchiveProduct, useGetProducts } from 'api/query-hooks/product';
import { AppContext } from 'App';
import CottagePagination from 'components/Common/CottagePagination';
import { TABLE_PAGINATION_SIZE } from 'constants/index';
import { Spinner } from 'components/Common/Spinner';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Params } from 'constants/Routes';
import CottageTabs from 'components/Common/CottageTabs';
import ProductsTableHeader from '../ProductsTableHeader';
import { CottageTab } from 'components/Common/CottageTabs/CottageTabs';
import { displayableMonetaryValue, toCamelCase } from 'utils';
import { Box, Badge, Tooltip, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import CottageTooltip from 'components/Common/CottageTooltip';

interface IProductsTableProps {}

export const ProductsTabName = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
};

const tabs: CottageTab[] = [
  { name: ProductsTabName.ACTIVE, href: '#', current: true, count: 0 },
  { name: ProductsTabName.ARCHIVED, href: '#', current: false, count: 0 },
];

export interface IProductTableData {
  id: string;
  description?: string | null;
  title: string;
  price: MonetaryValue;
  images: Array<string>;
  categories: Array<string>;
  tags: Array<string>;
  ingredients: Array<Ingredient>;
  nutrition?: Nutrition | null;
}

const ProductsTable: React.FC<IProductsTableProps> = () => {
  const businessId = useContext(AppContext).businessId;
  const [endCursors, setEndCursors] = useState<string[]>([]);
  const [endCursorsIndex, setEndCursorsIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState(ProductsTabName.ACTIVE);
  const history = useHistory();

  const { subdomain } = useParams<Params>();

  const after = endCursorsIndex !== -1 ? endCursors[endCursorsIndex] : undefined;

  const filters: FilterProductsInput = {
    status: activeTab === ProductsTabName.ACTIVE ? ProductStatus.ACTIVE : ProductStatus.ARCHIVED,
  };
  const pagination: PaginationInput = {
    first: TABLE_PAGINATION_SIZE,
    after,
  };

  const getProducts = useGetProducts({ businessId }, filters, pagination, {
    onSettled: (data) => {
      const endCursor = data?.data?.getBusiness?.products?.pageInfo.endCursor;
      if (endCursor) {
        setEndCursors([...endCursors, endCursor]);
      }
    },
  });

  const onNextPage = () => setEndCursorsIndex(endCursorsIndex + 1);
  const onPreviousPage = () => setEndCursorsIndex(endCursorsIndex - 1);
  const archiveProduct = useArchiveProduct();

  const productList: IProductTableData[] =
    getProducts.data?.data?.getBusiness?.products?.edges.map((e) => e.node) || [];

  const pageInfo = getProducts.data?.data?.getBusiness?.products?.pageInfo;

  const renderTableBody = () => {
    if (getProducts.isLoading || getProducts.isFetching) {
      return (
        <tr>
          <td colSpan={8}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (getProducts.isError) {
      return (
        <tr>
          <td
            colSpan={8}
            className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
            Something went wrong.
          </td>
        </tr>
      );
    }

    if (productList.length === 0) {
      return (
        <tr>
          {activeTab === ProductsTabName.ACTIVE && Object.values(filters).length === 1 ? (
            <td
              colSpan={8}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              You have not created any products yet.
              {
                <Link
                  className="text-lightGreen-100 mt-4 ml-1 font-semibold focus:shadow-none hover:underline"
                  to={`/business/${subdomain}/products/new`}>
                  Create your first product.
                </Link>
              }
            </td>
          ) : (
            <td
              colSpan={8}
              className="px-40 py-10 font-sans text-sm font-medium text-darkGray opacity-50 text-center">
              No products were found.
            </td>
          )}
        </tr>
      );
    }

    return productList.map((product) => (
      <tr key={product.id} className="cursor-default">
        <td className="px-2 py-2 text-sm text-left">
          <Box boxSize="56px">
            <div
              className="w-full h-full bg-cover rounded-lg cursor-pointer"
              onClick={() => {
                history.push(`/business/${subdomain}/products/${product.id}`);
              }}
              style={{
                backgroundImage: `url(${
                  product.images[0] ||
                  'https://cdn.cottage.menu/assets/common/default_food_image.svg'
                })`,
              }}></div>
          </Box>
        </td>
        <td className="block px-2 py-2 text-sm font-medium text-darkGreen text-left">
          <Text
            className="text-sm font-medium text-darkGreen text-left hover:underline cursor-pointer overflow-hidden overflow-ellipsis"
            noOfLines={1}
            onClick={() => {
              history.push(`/business/${subdomain}/products/${product.id}`);
            }}>
            {product.title}
          </Text>
          <div className="flex mt-1 flex-row items-center">
            <CottageTooltip text={product.categories.map((c) => toCamelCase(c)).join(', ')}>
              <Badge
                bgColor="#E4EEF7"
                borderRadius="6px"
                paddingX="6px"
                paddingY="4px"
                color="#525D5F"
                className="text-xs font-semibold text-center capitalize">
                Categories <span>{product.categories.length || null}</span>
              </Badge>
            </CottageTooltip>
            <CottageTooltip text={product.tags.map((c) => toCamelCase(c)).join(', ')}>
              <Badge
                bgColor="#FFD8BF"
                borderRadius="6px"
                paddingX="6px"
                paddingY="4px"
                color="#525D5F"
                className="text-xs font-semibold text-center capitalize ml-1">
                Dietary <span>{product.tags.length > 0 ? product.tags.length : null}</span>
              </Badge>
            </CottageTooltip>
          </div>
        </td>
        <td
          className={
            product.description
              ? 'px-2 py-2 text-sm text-darkGreen text-left'
              : 'px-2 py-2 text-sm text-darkGreen opacity-50 text-left'
          }>
          <Text className="text-sm overflow-hidden overflow-ellipsis" noOfLines={2}>
            {product.description || 'No description provided'}
          </Text>
        </td>
        <td className="px-2 py-2 text-sm font-medium text-darkGreen text-right">
          <div className="flex flex-col items-center">
            {product.nutrition?.calorie ||
            product.nutrition?.carbohydrate ||
            product.nutrition?.protein ||
            product.nutrition?.fat ? (
              <CottageTooltip
                text={`
              Calories: ${product.nutrition?.calorie || 0},\n
              Fats: ${product.nutrition?.fat || 0},\n
              Carbohydrates: ${product.nutrition?.carbohydrate || 0},\n
              Proteins: ${product.nutrition?.protein || 0}
              `}>
                <Badge
                  bgColor="#E3EDE9"
                  borderRadius="6px"
                  paddingX="6px"
                  paddingY="4px"
                  color="#525D5F"
                  width="89px"
                  className="text-xs font-semibold text-center capitalize">
                  Nutrition Info
                </Badge>
              </CottageTooltip>
            ) : null}
            {product.ingredients.length > 0 ? (
              <CottageTooltip
                text={product.ingredients?.map((i) => toCamelCase(i.name) || '').join(', ')}>
                <Badge
                  bgColor="#FCF9E9"
                  borderRadius="6px"
                  paddingX="6px"
                  paddingY="4px"
                  color="#525D5F"
                  width="89px"
                  className="text-xs font-semibold text-center capitalize mt-1">
                  Ingredients
                </Badge>
              </CottageTooltip>
            ) : null}
          </div>
        </td>
        <td className="px-4 py-2 text-sm font-semibold text-darkGray text-right whitespace-nowrap">
          {displayableMonetaryValue(product.price)}
        </td>
        <td className="px-4 py-2 text-sm font-semibold">
          <ChevronRightIcon
            className="w-5 h-5 mx-auto text-lightGreen-100 whitespace-nowrap cursor-pointer"
            onClick={() => {
              history.push(`/business/${subdomain}/products/${product.id}`);
            }}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col my-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <CottageTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={(tabName: string) => setActiveTab(tabName)}
            />
          </div>
          <div className="px-4 mt-3 overflow-hidden bg-white border-b border-gray-200 rounded-lg shadow">
            <ProductsTableHeader totalProducts={productList.length} activeTab={activeTab} />
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-left"
                    style={{ width: '90px' }}>
                    Image
                  </th>
                  <th scope="col" className="px-2 pt-0.5 pb-2 text-xs font-semibold text-left">
                    Title/Category
                  </th>
                  <th scope="col" className="px-2 pt-0.5 pb-2 text-xs font-semibold text-left">
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-2 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right"
                    style={{ width: '100px' }}></th>{' '}
                  {/* Empty intentionally to maintain consistency of th to td */}
                  <th
                    scope="col"
                    className="px-4 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right whitespace-nowrap"
                    style={{ width: '10px' }}>
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 pt-0.5 pb-2 text-xs font-semibold tracking-wider text-right whitespace-nowrap"
                    style={{ width: '10px' }}></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{renderTableBody()}</tbody>
            </table>
            <CottagePagination
              isLoading={getProducts.isLoading}
              currentPageSize={productList.length}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              hasNextPage={!!pageInfo?.hasNextPage}
              hasPreviousPage={!!pageInfo?.hasPreviousPage}
              currentPageIndex={endCursorsIndex + 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
