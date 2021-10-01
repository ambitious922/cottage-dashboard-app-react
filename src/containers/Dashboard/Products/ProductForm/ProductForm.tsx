import React, { useContext, useRef, useState } from 'react';
import { Formik, Form, Field, FieldProps, FieldArray } from 'formik';
import { v4 as uuidv4 } from 'uuid';

import { CreateProductInput, UpdateProductInput } from 'API';
import { AppContext } from 'App';
import { useHistory, useParams } from 'react-router';
import { Params } from 'constants/Routes';
import { useCreateProduct, useUpdateProduct } from 'api/query-hooks/product';
import {
  IngredientUnitValues,
  IProductFormValues,
  ProductFormFieldValues,
  ProductFormValidation,
} from './ProductFormField';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Select,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { Box, Stack } from '@chakra-ui/layout';

import ContainerHeader from 'components/Common/ContainerHeader';
import Sidebar from 'components/Common/Sidebar';
import CottageTag, { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import DietaryTagModal from '../DietaryTagModal';
import CategoryTagModal from '../CategoryTagModal';
import {
  QuestionMarkCircleIcon,
  StarIcon as StarIconOutline,
  TrashIcon,
} from '@heroicons/react/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/solid';

import { FrontendImage } from 'containers/Dashboard/Plans/CreatePlan/PlanFormFields';
import { removeImage, uploadImage, UploadImageInput } from 'api/images';
import EditFormPopover from 'components/Common/EditFormPopover/EditFormPopover';
import ImageCropForm, { CropImageType } from 'components/Common/ImageCropForm';

import NumberFormat from 'react-number-format';
import { ProductErrors } from 'models/error';
import { errorToast } from 'components/Common/Toast';

interface ProductFormProps {
  product?: IProductFormValues;
  productId?: string;
}

type FormValues = {
  file_: FileList;
};

const ProductForm: React.FC<ProductFormProps> = ({ product, productId }) => {
  const firstImageKey = product?.images?.size ? Array.from(product.images.keys())[0] : '';

  const { businessId } = useContext(AppContext);

  const { subdomain } = useParams<Params>();
  const history = useHistory();
  const toast = useToast();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [fileSizeModalVisible, setFileSizeModalVisible] = useState(false);
  const [localFileMap] = useState<Map<string, File>>(new Map());
  const [defaultImageKey, setDefaultImageKey] = useState(firstImageKey);

  const [croppingModalVisible, setCroppingModalVisible] = useState(false);
  const [upImg, setUpImg] = useState<any>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);

  const isEdit = !!product;
  const pushToProducts = () => history.push(`/business/${subdomain}/products`);
  const pushToProductDetails = (id?: string) =>
    history.push(`/business/${subdomain}/products/${id || ''}`);

  const uploadImageButton = useRef<HTMLInputElement>(null);

  const generateImageKey = () => {
    return `business/${businessId}/product/${uuidv4()}.jpeg`;
  };

  const onBackClick = () =>
    isEdit && productId ? pushToProductDetails(productId) : pushToProducts();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const createProductHelper = async (values: IProductFormValues) => {
    const castedValues = await ProductFormValidation.validate(values);
    const { title, price, tags, description, categories, nutrition, ingredients } = castedValues;
    const { images } = values;

    const newImageMap = images as unknown as Map<string, string>; // https://github.com/jquense/yup/issues/524

    const newImageUrls: string[] = Array.from(newImageMap.keys());
    // move default key to front
    if (newImageUrls.length > 1) {
      const index = newImageUrls.indexOf(defaultImageKey);
      if (index > -1) {
        newImageUrls.splice(index, 1);
      }
      newImageUrls.unshift(defaultImageKey);
    }

    const input: CreateProductInput = {
      businessId,
      title,
      price,
      tags,
      description,
      categories,
      nutrition,
      ingredients,
      images: newImageUrls ? newImageUrls : undefined,
    };

    for (const imageUrl of newImageUrls) {
      const file = localFileMap.get(imageUrl);
      if (file) {
        const imageInput: UploadImageInput = {
          file: file,
          url: imageUrl,
        };
        try {
          setUploadingImage(true);
          await uploadImage(imageInput);
        } catch (e) {
          delete input.images;
        }
      }
    }

    try {
      const res = await createProduct.mutateAsync(input);
      pushToProductDetails(res.data?.createProduct?.product?.id);
    } catch (e) {
      if (input.images) {
        for (const image of input.images) {
          await removeImage(image);
        }
      }
      throw e;
    } finally {
      setUploadingImage(false);
    }
  };

  const updateProductHelper = async (values: IProductFormValues) => {
    if (!productId) {
      return;
    }

    const castedValues = await ProductFormValidation.validate(values);
    const { title, price, tags, description, categories, nutrition, ingredients } = castedValues;
    const { images } = values;
    const newImageMap = images as unknown as Map<string, string>; // https://github.com/jquense/yup/issues/524

    const updatedImageUrls: string[] = Array.from(newImageMap.keys());
    // move default key to front
    if (updatedImageUrls.length > 1) {
      const index = updatedImageUrls.indexOf(defaultImageKey);
      if (index > -1) {
        updatedImageUrls.splice(index, 1);
      }
      updatedImageUrls.unshift(defaultImageKey);
    }

    const input: UpdateProductInput = {
      businessId,
      productId,
      price,
      title,
      tags,
      description,
      categories,
      nutrition,
      ingredients,
      images: updatedImageUrls ? updatedImageUrls : undefined,
    };

    const newImagesUploaded: string[] = [];
    const oldImagesDeleted: string[] = [];

    // upload new images
    for (const imageUrl of updatedImageUrls) {
      const file = localFileMap.get(imageUrl);
      // it is a newly uploaded image
      if (file) {
        const imageInput: UploadImageInput = {
          file: file,
          url: imageUrl,
        };
        try {
          setUploadingImage(true);
          await uploadImage(imageInput);
          newImagesUploaded.push(imageUrl);
        } catch (e) {
        } finally {
          setUploadingImage(false);
        }
      }
    }

    try {
      const res = await updateProduct.mutateAsync(input);

      // delete images after mutation is succesful, since if the mutation fails we no longer have reference to the uploaded file
      const previousImages = Object.keys(product?.images || new Map());
      for (const imageUrl of previousImages) {
        // this image was deleted
        if (!newImageMap.has(imageUrl)) {
          // TODO: LOG this since this is a leak, maybe calling API
          await removeImage(imageUrl);
          oldImagesDeleted.push(imageUrl);
        }
      }

      pushToProductDetails(res.data?.updateProduct?.product?.id);
    } catch (e) {
      // the update failed, so we need to delete the new images that we uploaded
      for (const imageUrl of newImagesUploaded) {
        await removeImage(imageUrl);
      }
      throw e;
    } finally {
    }
  };

  const onSubmit = async (values: IProductFormValues) => {
    const valuesPostCentConversion = {
      ...values,
      price: values.price ? Math.round(values.price * 100) : undefined,
    };
    try {
      if (isEdit) {
        await updateProductHelper(valuesPostCentConversion);
      } else {
        await createProductHelper(valuesPostCentConversion);
      }
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

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return 'Files is required';
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb';
      }
    }
    return true;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      //Open image crop modal
      setCroppingModalVisible(true);
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setFileInfo(e.target.files[0]);
    }
  };

  const renderImagePreview = (key: string, url: string | undefined, onRemoveClick: () => void) => {
    if (!url) {
      return (
        <div className="mb-2 mt-7">
          <h5 className="text-sm font-normal text-center text-grey">
            You haven't added any images yet.
          </h5>
        </div>
      );
    } else {
      return (
        <div
          className="flex items-center justify-between px-3 py-2 border-2 rounded-lg gap-x-6 border-lightGreen-100"
          style={{ width: '188px', height: '126px' }}>
          <div
            className="w-full h-full bg-cover rounded-lg"
            style={{ backgroundImage: `url(${url})` }}></div>
          <div className="h-full flex flex-col justify-center gap-6">
            {key === defaultImageKey ? (
              <StarIconSolid color={'#ffd666'} className="w-7 h-7" />
            ) : (
              <StarIconOutline
                color={'#ffd666'}
                className="w-6 h-6 ml-1 cursor-pointer"
                onClick={() => setDefaultImageKey(key)}
              />
            )}
            <TrashIcon color="#D2E3D5" className="w-7 h-7 cursor-pointer" onClick={onRemoveClick} />
          </div>
        </div>
      );
    }
  };

  const onClose = () => {
    setCroppingModalVisible(false);
  };

  // convert the price from cents to dollars before displaying to the customer
  const initialPrice = product?.price ? product?.price / 100 : undefined;
  const productWithDollarsFormValues = product ? { ...product, price: initialPrice } : undefined;

  return (
    <>
      <Formik
        initialValues={productWithDollarsFormValues || ProductFormFieldValues}
        onSubmit={(values) => onSubmit(values)}
        isInitialValid={isEdit}
        validationSchema={ProductFormValidation}>
        {({ isValid, setFieldValue, values, submitForm, errors, registerField }) => {
          return (
            <div className="md:flex md:h-full">
              <div
                className="flex-grow px-2 py-2 md:px-7 overflow-auto"
                style={{
                  backgroundColor: '#E5E5E5',
                }}>
                <ContainerHeader
                  headerText={isEdit ? 'Edit Product' : 'New Product'}
                  onBackClick={onBackClick}
                />
                <Box
                  className="items-center justify-center mx-auto mb-4 mt-8"
                  style={{ maxWidth: '670px' }}>
                  <Form>
                    <Box className="px-6 pt-4 pb-2 my-0 bg-white border shadow-lg sm:my-4 border-outline-300 rounded-xl">
                      <Heading
                        as="h2"
                        size="md"
                        fontFamily="inherit"
                        className="text-base font-medium">
                        Product details
                      </Heading>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-5 md:gap-4">
                        <Field name="title">
                          {({ field, meta }: FieldProps) => (
                            <FormControl
                              className="col-span-2 mt-4"
                              isInvalid={!!(meta.error && meta.touched)}>
                              <FormLabel htmlFor="title" className="px-2 mb-1 text-sm font-medium">
                                Item Name
                              </FormLabel>
                              <Input
                                {...field}
                                id="title"
                                size="md"
                                width="100%"
                                className="border-lightGreen-100"
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="price">
                          {({ field, meta }: FieldProps) => (
                            <FormControl
                              className="mt-4"
                              isInvalid={!!(meta.error && meta.touched)}>
                              <FormLabel htmlFor="price" className="px-2 mb-1 text-sm font-medium">
                                Price
                              </FormLabel>
                              <NumberFormat
                                {...field}
                                id="price"
                                style={{ padding: '7px 16px' }}
                                className="border-lightGreen-100 rounded-md w-full"
                                decimalSeparator="."
                                displayType="input"
                                type="text"
                                allowNegative={false}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                placeholder={'$'}
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </div>
                      <Field name="description">
                        {({ field, meta }: FieldProps) => (
                          <FormControl className="mt-4" isInvalid={!!(meta.error && meta.touched)}>
                            <FormLabel
                              htmlFor="description"
                              className="px-2 mb-1 text-sm font-medium">
                              Description{' '}
                              <span className="ml-1 text-xs font-normal text-grey">(optional)</span>
                            </FormLabel>
                            <Textarea
                              {...field}
                              id="description"
                              size="md"
                              width="full"
                              className="border-lightGreen-100"
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Box className="mt-4">
                        <Field name="tags">
                          {({ field, meta }: FieldProps) => (
                            <FormControl isInvalid={!!(meta.touched && meta.error)}>
                              <FormLabel htmlFor="tags" className="mb-1 text-sm font-medium">
                                Food tags
                                <span className="ml-1 text-xs font-normal text-grey">
                                  (optional)
                                </span>
                              </FormLabel>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Stack direction="row" alignItems="flex-start">
                          <DietaryTagModal
                            tagsToHide={values['tags'] || []}
                            isSelect={true}
                            onSelect={(tags: string[]) =>
                              setFieldValue('tags', [...(values['tags'] || []), ...tags])
                            }>
                            <CottageTag
                              tagColor={'#D2E3D5'}
                              tagLabelColor="#235C48"
                              textSize="14px"
                              title={'Add'}
                              tagType={CottageTagType.ADD}
                            />{' '}
                          </DietaryTagModal>
                          {(values['tags'] || []).map((tag) => (
                            <CottageTag
                              onClick={() =>
                                setFieldValue('tags', [
                                  ...(values['tags'] || []).filter((t) => t !== tag),
                                ])
                              }
                              tagColor={'#FFD8BF'}
                              tagLabelColor="#525D5F"
                              textSize="14px"
                              title={tag}
                              tagType={CottageTagType.DELETE}
                            />
                          ))}
                        </Stack>
                      </Box>
                      <Box className="mt-4">
                        <Field name="categories">
                          {({ field, meta }: FieldProps) => (
                            <FormControl isInvalid={!!(meta.touched && meta.error)}>
                              <FormLabel htmlFor="categories" className="mb-1 text-sm font-medium">
                                Categories
                                <span className="ml-1 text-xs font-normal text-grey">
                                  (optional)
                                </span>
                              </FormLabel>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Stack direction="row" alignItems="flex-start">
                          <CategoryTagModal
                            categoriesToHide={values['categories'] || []}
                            isSelect={true}
                            onSelect={(categories: string[]) =>
                              setFieldValue('categories', [
                                ...(values['categories'] || []),
                                ...categories,
                              ])
                            }>
                            <CottageTag
                              tagColor={'#D2E3D5'}
                              tagLabelColor="#235C48"
                              textSize="14px"
                              title={'Add'}
                              tagType={CottageTagType.ADD}
                            />{' '}
                          </CategoryTagModal>
                          {(values['categories'] || []).map((category) => (
                            <CottageTag
                              onClick={() =>
                                setFieldValue('categories', [
                                  ...(values['categories'] || []).filter((t) => t !== category),
                                ])
                              }
                              tagColor={'#E4EEF6'}
                              tagLabelColor="#525D5F"
                              textSize="14px"
                              title={category}
                              tagType={CottageTagType.DELETE}
                            />
                          ))}
                        </Stack>
                      </Box>
                      <Box className="mt-4">
                        <Field name="images">
                          {({ field, form }: FieldProps) => (
                            <FormControl className="mt-4">
                              <FormLabel htmlFor="images" className="mb-1 text-sm font-medium">
                                Product Images{' '}
                                <span className="ml-1 text-xs font-normal text-grey">
                                  (optional)
                                </span>
                              </FormLabel>
                              <React.Fragment>
                                <input
                                  ref={uploadImageButton}
                                  onChange={(e) => handleImageSelect(e)}
                                  type="file"
                                  className="hidden"
                                />
                                <Button
                                  className="h-8 text-sm font-semibold bg-softGreen-200 hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
                                  style={{ width: '142px' }}
                                  onClick={() => uploadImageButton.current?.click()}>
                                  + Upload Image
                                </Button>
                              </React.Fragment>{' '}
                              <Box paddingY="16px" className="flex gap-6 flex-wrap">
                                {(values['images'] ? Array.from(values['images']) : []).map((img) =>
                                  renderImagePreview(img[0], img[1], () => {
                                    const map = values['images'] || new Map();
                                    map.delete(img[0]);

                                    if (img[0] === defaultImageKey) {
                                      if (map.size === 0) {
                                        setDefaultImageKey('');
                                      } else {
                                        const newImageKey = Array.from(map.keys())[0];
                                        setDefaultImageKey(newImageKey);
                                      }
                                    }
                                    setFieldValue('images', map);
                                  })
                                )}
                              </Box>
                            </FormControl>
                          )}
                        </Field>
                      </Box>
                    </Box>
                    <Box className="p-6 my-0 bg-white border shadow-lg sm:my-4 border-outline-300 rounded-xl">
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <FormLabel htmlFor="nutrition" fontSize="16px" fontWeight="500">
                            Nutritional info
                            <span className="ml-1 font-normal text-grey">(Optional)</span>
                          </FormLabel>
                        </Box>
                      </Stack>
                      <Stack
                        direction="row"
                        marginTop="16px"
                        spacing="4"
                        justifyContent="space-between"
                        alignItems="flex-start">
                        <Box>
                          <Field name="nutrition.calorie">
                            {({ field, form, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel
                                  htmlFor="nutrition.calorie"
                                  fontSize="14px"
                                  fontWeight="500"
                                  paddingX="8px">
                                  Calories (cal)
                                </FormLabel>
                                <NumberInput
                                  min={0}
                                  max={10000}
                                  name={field.name}
                                  value={field.value || 0}
                                  onChange={(e) => form.setFieldValue(field.name, e)}
                                  focus="false">
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <Box>
                          <Field name="nutrition.protein">
                            {({ field, form, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel
                                  htmlFor="nutrition.protein"
                                  fontSize="14px"
                                  fontWeight="500"
                                  paddingX="8px">
                                  Protein (g)
                                </FormLabel>
                                <NumberInput
                                  min={0}
                                  max={10000}
                                  name={field.name}
                                  pattern="(.*?)"
                                  value={field.value || 0}
                                  focus="false"
                                  onChange={(e) => form.setFieldValue(field.name, e)}>
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <Box>
                          <Field name="nutrition.fat">
                            {({ field, form, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel
                                  htmlFor="nutrition.fat"
                                  fontSize="14px"
                                  fontWeight="500"
                                  paddingX="8px">
                                  Fats (g)
                                </FormLabel>
                                <NumberInput
                                  min={0}
                                  max={10000}
                                  name={field.name}
                                  value={field.value || 0}
                                  focus="false"
                                  pattern="(.*?)"
                                  onChange={(e) => form.setFieldValue(field.name, e)}>
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{meta.error}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <Box>
                          <Field name="nutrition.carbohydrate">
                            {({ field, form, meta }: FieldProps) => (
                              <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                <FormLabel
                                  htmlFor="nutrition.carbohydrate"
                                  fontSize="14px"
                                  fontWeight="500"
                                  paddingX="8px">
                                  Carbs (g)
                                </FormLabel>
                                <NumberInput
                                  min={0}
                                  max={10000}
                                  name={field.name}
                                  value={field.value || 0}
                                  pattern="(.*?)"
                                  focus="false"
                                  onChange={(e) => form.setFieldValue(field.name, e)}>
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{meta.error}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                      </Stack>
                      <Stack>
                        <Text
                          paddingTop="24px"
                          className="text-xs font-normal text-grey text-center">
                          Fields left blank will not be shown.
                        </Text>
                      </Stack>
                    </Box>
                    <Box className="p-6 my-0 bg-white border shadow-lg sm:my-4 border-outline-300 rounded-xl">
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <FormLabel htmlFor="nutrition" fontSize="16px" fontWeight="500">
                            Ingredients
                            <span className="ml-2 font-normal text-grey">(Optional)</span>
                          </FormLabel>
                        </Box>
                      </Stack>

                      <FieldArray name="ingredients">
                        {(arrayHelpers) => (
                          <>
                            {(values['ingredients'] || []).map((_, index) => (
                              <div
                                className="grid grid-cols-2 mt-2 sm:grid-cols-6 gap-x-4 gap-y-2"
                                key={index}>
                                <div className="col-span-2 sm:col-span-3">
                                  <Field name={`ingredients[${index}].name`}>
                                    {({ field, meta }: FieldProps) => (
                                      <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                        <FormLabel
                                          htmlFor={`ingredients[${index}].name`}
                                          fontSize="14px"
                                          fontWeight="500"
                                          paddingX="8px">
                                          Name
                                        </FormLabel>
                                        <Input {...field} id={`ingredients[${index}].name`} />
                                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                </div>
                                <div className="col-span-1">
                                  <Field name={`ingredients[${index}].value`}>
                                    {({ field, meta }: FieldProps) => (
                                      <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                        <FormLabel
                                          htmlFor={`ingredients[${index}].value`}
                                          fontSize="14px"
                                          fontWeight="500"
                                          paddingX="8px">
                                          Amount
                                        </FormLabel>
                                        <NumberInput
                                          value={field.value || ''}
                                          onChange={(e) => {
                                            setFieldValue(`ingredients[${index}].value`, e);
                                          }}
                                          max={1000}
                                          focus="false">
                                          <NumberInputField />
                                          <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                          </NumberInputStepper>
                                        </NumberInput>
                                      </FormControl>
                                    )}
                                  </Field>
                                </div>
                                <div className="col-span-2">
                                  <div className="flex align-baseline">
                                    <Field name={`ingredients[${index}].unit`}>
                                      {({ field, meta }: FieldProps) => (
                                        <FormControl isInvalid={!!(meta.touched && meta.error)}>
                                          <FormLabel
                                            htmlFor={`ingredients[${index}].unit`}
                                            fontSize="14px"
                                            fontWeight="500"
                                            paddingX="8px">
                                            Unit
                                          </FormLabel>
                                          <Select
                                            {...field}
                                            id={`ingredients[${index}].unit`}
                                            value={field.value || ''}>
                                            {IngredientUnitValues.map((unit) => (
                                              <option value={unit.value} key={unit.value}>
                                                {unit.name}
                                              </option>
                                            ))}
                                          </Select>
                                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                                        </FormControl>
                                      )}
                                    </Field>
                                    <Box
                                      className="flex justify-end w-1/2"
                                      paddingX="12px"
                                      paddingTop="35px">
                                      <TrashIcon
                                        color="#D2E3D5"
                                        className="w-7 h-7"
                                        onClick={() => arrayHelpers.remove(index)}></TrashIcon>
                                    </Box>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <Button
                              className="mt-4 text-sm font-semibold bg-softGreen-200 hover:bg-softGreen-100"
                              onClick={() =>
                                arrayHelpers.push({ name: '', value: undefined, unit: undefined })
                              }>
                              + Add Ingredient
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </Box>
                  </Form>
                </Box>
              </div>
              <div
                className="flex-none w-full pb-5 sm:w-80"
                style={{
                  width: '338px',
                }}>
                <Box className="mx-auto">
                  <Sidebar
                    onSubmit={() => submitForm()}
                    onCancel={isEdit ? () => pushToProductDetails(productId) : pushToProducts}
                    isEnabled={isValid}
                    buttonTitle={isEdit ? 'Save product' : 'Create product'}
                    isLoading={createProduct.isLoading || updateProduct.isLoading || uploadingImage}
                  />
                  <div className="mx-3.5 px-4 py-0">
                    <div
                      className="flex justify-between gap-4 p-3 rounded-lg"
                      style={{ background: '#FCF9E9' }}>
                      <div>
                        <QuestionMarkCircleIcon className="text-black h-7 w-7" />
                      </div>
                      <span className="text-sm text-gray-500">
                        Once this product is created you can easily reference it for every schedule
                        you create in your location dashboard. You can even override pricing for
                        special events or stick with the defualt price you set here.
                      </span>
                    </div>
                  </div>
                </Box>
              </div>
              {/* Start image crop modal */}
              <EditFormPopover isOpen={croppingModalVisible} onClose={onClose} title="Image Crop">
                <ImageCropForm
                  cropFormType={CropImageType.FRONTEND_IMAGE}
                  imageData={upImg}
                  fileInfo={fileInfo}
                  onCompleted={(img: FrontendImage) => {
                    const newFileUrl = generateImageKey();
                    localFileMap.set(newFileUrl, img.file);
                    // this is the only image
                    if (!defaultImageKey) {
                      setDefaultImageKey(newFileUrl);
                    }
                    // TODO: for multiple we would do
                    const map = values['images'] || new Map();
                    map.set(newFileUrl, img.url);
                    setFieldValue('images', new Map(map));
                  }}
                  onClose={onClose}
                />
              </EditFormPopover>
              {/* End image crop modal */}
            </div>
          );
        }}
      </Formik>
      <DietaryTagModal isSelect={true} />
      <CategoryTagModal isSelect={true} />
    </>
  );
};

export default ProductForm;
