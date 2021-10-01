import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Container, Box, Stack } from '@chakra-ui/layout';
import { Button, Text, Heading, Image, useToast } from '@chakra-ui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

import { Spinner } from 'components/Common/Spinner';
import {
  useGetProduct,
  useArchiveProduct,
  useUpdateProduct,
  useGetProductImages,
} from 'api/query-hooks/product';
import { GetProductInput, ArchiveProductInput, ProductStatus, UpdateProductInput } from 'API';
import { AppContext } from 'App';
import { Params } from 'constants/Routes';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { GetImagesResult } from 'api/images';
import { displayableMonetaryValue } from 'utils';
import { ProductErrors } from 'models/error';
import { errorToast } from 'components/Common/Toast';

export interface ProductCardProps {
  productId: string;
}

export const ProductCardTabName = {
  ORDER_HISTORY: 'Order History',
  LOCATION_SETTINGS: 'Location Settings',
};

const ProductCard: React.FC<ProductCardProps> = ({ productId }) => {
  const history = useHistory();
  const { businessId } = useContext(AppContext);
  const { subdomain } = useParams<Params>();
  const toast = useToast();

  const [productImages, setProductImages] = useState<Map<string, string> | undefined>(undefined); // when this is set, we are done loading the product

  const productInput: GetProductInput = {
    businessId,
    productId,
  };

  const archiveProductMutation = useArchiveProduct();
  const updateProductMutation = useUpdateProduct();

  const getProductQuery = useGetProduct(productInput);
  const product = getProductQuery?.data?.data?.product;

  const { data } = getProductQuery;
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

  if (getProductQuery.isError || getProductImages.isError || !product) {
    return <div>Something went wrong</div>;
  }

  const isArchived = product.status === ProductStatus.ARCHIVED;

  const onEdit = () => {
    history.push(`/business/${subdomain}/products/${productId}/edit`);
  };

  const onArchive = async () => {
    const input: ArchiveProductInput = {
      productId,
      businessId,
    };

    await archiveProductMutation.mutateAsync(input);
  };

  const onUnarchive = async () => {
    const input: UpdateProductInput = {
      productId,
      businessId,
      status: ProductStatus.ACTIVE,
    };

    await updateProductMutation.mutateAsync(input);
  };

  const onSubmit = async () => {
    try {
      return isArchived ? await onUnarchive() : await onArchive();
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case ProductErrors.ProductLimitExceededErrorCode:
          message =
            'Product limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        default:
          message = 'Something went wrong';
          break;
      }
      errorToast(toast, message);
    }
  };

  let primaryImage;
  Array.from(productImages.values()).map((imageUrl, i) => {
    if (i === 0) {
      primaryImage = imageUrl;
    }
  });

  const displayNutritionType = (nutritionQuantity: number | null | undefined, suffix?: string) => {
    if (!nutritionQuantity && nutritionQuantity !== 0) {
      return '';
    }

    return `${nutritionQuantity} ${suffix || ''}`;
  };

  const toDisplayableLowerCase = (title?: string | null) => {
    if (!title) {
      return '';
    }
    return title.replace('_', ' ').toLowerCase() + '(s)';
  };

  return (
    <>
      <Stack direction="column" spacing={4} className="shadow-md">
        <div className="bg-white pl-8 pr-6 py-6 w-full">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            className="block md:flex">
            <Box>
              <Stack direction="row" spacing={55} alignItems="flex-start" className="block md:flex">
                <Box>
                  <Image
                    boxSize="188px"
                    borderRadius="6px"
                    objectFit="cover"
                    src={
                      primaryImage ||
                      'https://cdn.cottage.menu/assets/common/default_food_image.svg'
                    }
                    alt="Product Image"
                  />
                </Box>
                <Box>
                  <Stack direction="row" spacing={4} className="">
                    <Box alignItems="center">
                      <Text className="text-sm font-medium text-grey mb-3">Item name</Text>
                      <Text className="text-base font-semibold text-darkGreen">
                        {data?.data?.product?.title}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={24} className="mt-4 mb-3">
                    <Box alignItems="center">
                      <Text className="text-sm font-medium text-grey mb-3">Price</Text>
                      <Text className="text-base font-normal text-darkGreen">
                        {displayableMonetaryValue(product.price)}
                      </Text>
                    </Box>
                    <Box alignItems="center">
                      <Text className="text-sm font-medium text-grey mb-3">Meal Category</Text>
                      <Text className="my-2 font-sm text-semibold text-darkGray">
                        {product.categories.length === 0 ? (
                          <Text className="font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap">
                            There are no categories for this product.
                          </Text>
                        ) : (
                          product.categories.map((category) => (
                            <CottageTag
                              tagColor={'#E4EEF6'}
                              tagLabelColor={'#525D5F'}
                              textSize="14px"
                              title={category}
                              tagType={CottageTagType.VIEW}
                            />
                          ))
                        )}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row" className="mb-4">
                    <Box alignItems="center">
                      <Text className="text-sm font-medium text-grey mb-3">Description</Text>
                      <Text
                        className={
                          product.description
                            ? 'text-sm font-normal text-darkGreen'
                            : 'py-2 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap'
                        }>
                        {product.description
                          ? product.description
                          : 'No description, edit to add one.'}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <Box className="ml-0 mt-4 sm:mt-0">
              <Stack direction="column" spacing={2}>
                <Button
                  fontSize="14px"
                  fontWeight="600"
                  onClick={onEdit}
                  width="200px"
                  height="36px"
                  leftIcon={<PencilIcon className="w-4 h-4" />}
                  className="text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none">
                  Edit Details
                </Button>
                <Button
                  fontSize="14px"
                  fontWeight="600"
                  width="200px"
                  height="36px"
                  onClick={onSubmit}
                  leftIcon={<TrashIcon className="w-5 h-5" />}
                  isLoading={
                    archiveProductMutation.isLoading ||
                    updateProductMutation.isLoading ||
                    getProductQuery.isFetching
                  }
                  className="text-lightGreen-100 bg-softGreen hover:bg-softGreen-100 focus:outline-none focus:shadow-none">
                  {isArchived ? 'Unarchive' : 'Archive'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </div>
      </Stack>

      {isArchived && (
        <Box className="items-center justify-center mx-auto mb-4 mt-4">
          <CottageAlert severity={AlertSeverity.SOFTINFO}>
            <b>This product is archived</b>. It will no longer be accessible when creating a
            schedule. Existing orders will not be impacted.
          </CottageAlert>
        </Box>
      )}

      <Stack direction="column" spacing={4} className="shadow-md my-4">
        <div className="bg-white pl-8 pr-6 py-6 w-full">
          <Heading as="h2" size="md" fontFamily="inherit" className="text-base font-medium mb-6">
            Other Details
          </Heading>
          <Heading as="h2" size="md" fontFamily="inherit" className="text-sm font-medium">
            Food Tags
          </Heading>
          <Container paddingStart={0} minW="xl" marginX="0px" padding="0">
            <Text className="my-2 font-sm text-semibold text-darkGray">
              {product.tags.length === 0 ? (
                <Text className="py-2 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap">
                  There are no tags associated with this product.
                </Text>
              ) : (
                product.tags.map((tag) => (
                  <CottageTag
                    tagColor={'#FFD8BF'}
                    tagLabelColor={'#525D5F'}
                    textSize="14px"
                    title={tag}
                    tagType={CottageTagType.VIEW}
                  />
                ))
              )}
            </Text>
          </Container>
          <Heading
            as="h2"
            size="md"
            fontFamily="inherit"
            marginTop="24px"
            className="text-sm font-medium">
            Product images
          </Heading>
          <Container paddingStart={0} minW="xl" marginX="0px" marginBottom="16px" padding="0">
            <Box className="flex my-4">
              {productImages.size === 0 ? (
                <Text className="font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap text-center">
                  There are no images for this product.
                </Text>
              ) : (
                Array.from(productImages.values()).map((imageUrl, i) => (
                  <Stack direction="row" alignItems="center" spacing={6}>
                    <Box boxSize="50px">
                      <div
                        className="w-full h-full bg-cover rounded-lg"
                        style={{ backgroundImage: `url(${imageUrl})` }}></div>
                    </Box>
                    {i === 0 && (
                      <Box
                        className="border-l-2"
                        height="50px"
                        paddingRight="24px"
                        borderColor="#C4C4C4"></Box>
                    )}
                  </Stack>
                ))
              )}
            </Box>{' '}
          </Container>
          <Box>
            <Heading
              as="h2"
              size="md"
              fontFamily="inherit"
              marginTop="24px"
              className="text-sm font-medium">
              Nutritional info
            </Heading>
            <Stack direction="row" spacing={100} className="my-4 px-2">
              <Box alignItems="center">
                <Text className="text-sm font-medium text-grey mb-3">Calories</Text>
                <Text className="text-sm font-normal text-darkGreen">
                  {displayNutritionType(product.nutrition?.calorie, 'cal')}
                </Text>
              </Box>
              <Box alignItems="center">
                <Text className="text-sm font-medium text-grey mb-3">Proteins</Text>
                <Text className="text-sm font-normal text-darkGreen">
                  {displayNutritionType(product.nutrition?.protein, 'g')}
                </Text>
              </Box>
              <Box alignItems="center">
                <Text className="text-sm font-medium text-grey mb-3">Fats</Text>
                <Text className="text-sm font-normal text-darkGreen">
                  {displayNutritionType(product.nutrition?.fat, 'g')}
                </Text>
              </Box>
              <Box alignItems="center">
                <Text className="text-sm font-medium text-grey mb-3">Carbohydrates</Text>
                <Text className="text-sm font-normal text-darkGreen">
                  {displayNutritionType(product.nutrition?.carbohydrate, 'g')}
                </Text>
              </Box>
            </Stack>
          </Box>
          <Box width="50%">
            <Heading
              as="h2"
              size="md"
              fontFamily="inherit"
              marginTop="24px"
              className="text-sm font-medium">
              Ingredients
            </Heading>
            {/* Divider line above the first indgredient */}
            {product.ingredients.length > 0 && <hr className="mt-4" />}
            <Stack direction="column">
              {product.ingredients.length === 0 ? (
                <Text className="py-4 font-sans text-sm font-medium text-darkGray opacity-50 whitespace-nowrap">
                  This product has no ingredients listed.
                </Text>
              ) : (
                product.ingredients.map((ingredient) => (
                  <>
                    <Stack
                      direction="row"
                      spacing={4}
                      className="py-4 m-0 text-darkGreen"
                      justifyContent="space-between">
                      <Text className="text-sm font-semibold">{ingredient.name}</Text>
                      <Stack direction="row">
                        <Text className="text-sm font-normal">{ingredient.value}</Text>
                        <Text className="text-sm font-normal">
                          {toDisplayableLowerCase(ingredient.unit)}
                        </Text>
                      </Stack>
                    </Stack>
                    <hr className="m-0" />
                  </>
                ))
              )}
            </Stack>
          </Box>
        </div>
      </Stack>
    </>
  );
};

export default ProductCard;
