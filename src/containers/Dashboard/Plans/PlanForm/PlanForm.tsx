import React, { useContext, useRef, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Textarea,
  Box,
  Button,
  useToast,
} from '@chakra-ui/react';

import { TrashIcon } from '@heroicons/react/outline';

import { CreatePlanInput, PlanInterval, UpdatePlanInput } from 'API';
import Sidebar from 'components/Common/Sidebar';
import { AppContext } from 'App';
import { useHistory, useParams } from 'react-router';
import { Params } from 'constants/Routes';
import { PlanErrors } from 'models/error';
import { useCreatePlan, useUpdatePlan } from 'api/query-hooks/plans';
import {
  CreatePlanFormValidation,
  CreatePlanFormValues,
  FrontendImage,
  PlanFormValues,
  PlanIntervalDisplayValues,
} from '../CreatePlan/PlanFormFields';
import ContainerHeader from 'components/Common/ContainerHeader';
import { UploadImageInput, uploadImage, removeImage } from 'api/images';
import CottageInfoDialog from 'components/Common/CottageInfoDialog';
import { enumKeys } from 'utils';
import EditFormPopover from 'components/Common/EditFormPopover/EditFormPopover';
import ImageCropForm, { CropImageType } from 'components/Common/ImageCropForm';
import CottageMapDropdown from 'components/Common/CottageMapDropdown';

import NumberFormat from 'react-number-format';
import CottageTooltip from 'components/Common/CottageTooltip';
import { errorToast } from 'components/Common/Toast';

export interface PlanFormProps {
  planId?: string;
  planFormValues?: PlanFormValues;
}

const PlansForm: React.FC<PlanFormProps> = ({ planFormValues, planId }) => {
  const history = useHistory();
  const toast = useToast();
  const { subdomain } = useParams<Params>();
  const { businessId } = useContext(AppContext);

  const [localFileMap] = useState<Map<string, File>>(new Map());
  const [fileSizeModalVisible, setFileSizeModalVisible] = useState(false);

  const [croppingModalVisible, setCroppingModalVisible] = useState(false);
  const [upImg, setUpImg] = useState<any>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);

  const isEdit = !!planFormValues;
  const goBack = (id?: string) =>
    id
      ? history.push(`/business/${subdomain}/plans/${id || ''}`)
      : history.push(`/business/${subdomain}/plans`);

  const pushToPlanDetails = (id?: string) =>
    history.push(`/business/${subdomain}/plans/${id || ''}`);

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const generateImageKey = () => {
    return `business/${businessId}/plan/${uuidv4()}.jpeg`;
  };

  const createPlanHelper = async (values: PlanFormValues) => {
    await CreatePlanFormValidation.validate(values);
    const { title, interval, value, price, description, images } = values;

    const newImageMap = images as unknown as Map<string, string>; // https://github.com/jquense/yup/issues/524

    const newImageUrls: string[] = Array.from(newImageMap.keys());
    const input: CreatePlanInput = {
      businessId,
      title,
      interval,
      value: value || 0,
      price: price || 0,
      description,
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
          await uploadImage(imageInput);
        } catch (e) {
          delete input.images;
        }
      }
    }

    try {
      const res = await createPlan.mutateAsync(input);
      pushToPlanDetails(res.data?.createPlan?.plan?.id || '');
    } catch (e) {
      if (input.images) {
        for (const image of input.images) {
          await removeImage(image);
        }
      }
      throw e;
    } finally {
    }
  };

  const updatePlanHelper = async (values: PlanFormValues) => {
    if (!planId) {
      return;
    }

    const castedValues = await CreatePlanFormValidation.validate(values);
    const { title, description, images } = castedValues;
    const newImageMap = images as unknown as Map<string, string>; // https://github.com/jquense/yup/issues/524

    const updatedImageUrls: string[] = Array.from(newImageMap.keys());
    const input: UpdatePlanInput = {
      businessId,
      title,
      planId,
      description,
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
          await uploadImage(imageInput);
          newImagesUploaded.push(imageUrl);
        } catch (e) {
          console.error(e);
        }
      }
    }

    try {
      await updatePlan.mutateAsync(input);

      // delete images after mutation is succesful, since if the mutation fails we no longer have reference to the uploaded file
      const previousImages = Object.keys(planFormValues?.images || new Map());
      for (const imageUrl of previousImages) {
        // this image was deleted
        if (!newImageMap.has(imageUrl)) {
          // TODO: LOG this since this is a leak, maybe calling API
          await removeImage(imageUrl);
          oldImagesDeleted.push(imageUrl);
        }
      }
    } catch (e) {
      // the update failed, so we need to delete the new images that we uploaded
      for (const imageUrl of newImagesUploaded) {
        await removeImage(imageUrl);
      }
      throw e;
    } finally {
      pushToPlanDetails(planId);
    }
  };

  const onSubmit = async (values: PlanFormValues) => {
    const valuesPostCentConversion = {
      ...values,
      price: values.price ? Math.round(values.price * 100) : undefined,
      value: values.value ? Math.round(values.value * 100) : undefined,
    };

    try {
      if (isEdit) {
        await updatePlanHelper(valuesPostCentConversion);
      } else {
        await createPlanHelper(valuesPostCentConversion);
      }
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case PlanErrors.PlanLimitExceededErrorCode:
          message =
            'Plan limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        case PlanErrors.PlanNotFoundErrorCode:
        case PlanErrors.BusinessNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      errorToast(toast, message);
    }
  };

  const onBackClick = () => history.push(`/business/${subdomain}/plans`);

  const uploadImageButton = useRef<HTMLInputElement>(null);

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

  const renderImagePreview = (url: string | undefined, onRemoveClick: () => void) => {
    if (!url) {
      <div className="mb-2 mt-7">
        <h5 className="text-sm font-normal text-center text-grey">
          You haven't added any images yet.
        </h5>
      </div>;
    } else {
      return (
        <div
          className="flex items-center justify-between px-3 py-2 mt-4 border-2 rounded-lg gap-x-6 border-lightGreen-100"
          style={{ width: '188px', height: '126px' }}>
          <div className="w-full h-full bg-cover" style={{ backgroundImage: `url(${url})` }}></div>
          <TrashIcon className="w-8 h-8 cursor-pointer" onClick={onRemoveClick} />
        </div>
      );
    }
  };

  const planImage = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState({ preview: '', raw: {} });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const onClose = () => {
    setCroppingModalVisible(false);
  };

  const initialPrice = planFormValues?.price ? planFormValues?.price / 100 : undefined;
  const initialValue = planFormValues?.value ? planFormValues?.value / 100 : undefined;
  const _planFormValues = planFormValues
    ? { ...planFormValues, price: initialPrice, value: initialValue }
    : undefined;

  return (
    <>
      <Formik
        initialValues={_planFormValues ? _planFormValues : CreatePlanFormValues}
        onSubmit={(values) => onSubmit(values)}
        isInitialValid={isEdit}
        validationSchema={CreatePlanFormValidation}>
        {({ isValid, setFieldValue, values, submitForm, errors }) => {
          return (
            <div className="md:flex md:h-full">
              <div
                className="flex-grow px-2 py-2 md:px-7"
                style={{
                  backgroundColor: '#E5E5E5',
                }}>
                <ContainerHeader
                  headerText={isEdit ? 'Edit Plan' : 'New meal plan'}
                  onBackClick={onBackClick}
                />
                <Box
                  className="items-center justify-center mx-auto mb-4"
                  style={{ maxWidth: '670px' }}>
                  <Form
                    className="px-6 pt-4 pb-8 my-0 bg-white border shadow-lg sm:my-8 border-outline-300 rounded-xl"
                    style={{ minWidth: '100%' }}>
                    <Heading
                      as="h2"
                      size="md"
                      fontFamily="inherit"
                      className="text-base font-medium">
                      Plan Details
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-5 md:gap-4">
                      <Field name="title">
                        {({ field, meta }: FieldProps) => (
                          <FormControl
                            isInvalid={!!(meta.error && meta.touched)}
                            className="col-span-2 mt-4">
                            <FormLabel htmlFor="title" className="px-2 mb-1 text-sm font-medium">
                              Plan Name
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
                          <FormControl isInvalid={!!(meta.error && meta.touched)} className="mt-4">
                            <FormLabel
                              htmlFor="price"
                              className="flex items-center gap-1.5 mb-1 px-2 text-sm font-medium">
                              Price&nbsp;
                              <CottageTooltip text="Subscribers will reoccurringly be charged this amount." />
                            </FormLabel>
                            <NumberFormat
                              {...field}
                              id="price"
                              disabled={isEdit}
                              style={{ padding: '7px 16px' }}
                              className={
                                isEdit
                                  ? 'border-lightGreen-100 rounded-md w-full opacity-40 cursor-not-allowed'
                                  : 'border-lightGreen-100 rounded-md w-full'
                              }
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-5 md:gap-4">
                      <Field name="interval">
                        {({ field, meta }: FieldProps) => (
                          <FormControl
                            isInvalid={!!(meta.error && meta.touched)}
                            className="col-span-2 mt-4">
                            <FormLabel
                              htmlFor="interval"
                              className="flex items-center gap-1.5 mb-1 px-2 text-sm font-medium">
                              Renewal Interval&nbsp;
                              <CottageTooltip text="Subscribers will be charged on this interval. The first charge is applied as soon as they purchase this plan. We create subscription invoices each time they are charged." />
                            </FormLabel>
                            <CottageMapDropdown
                              isDisabled={isEdit}
                              value={{
                                display: PlanIntervalDisplayValues[field.value as PlanInterval],
                                item: field.value as PlanInterval,
                              }}
                              onChange={(interval) => {
                                setFieldValue(field.name, PlanInterval[interval.item]);
                              }}
                              items={enumKeys(PlanInterval).map((interval) => {
                                return {
                                  display: PlanIntervalDisplayValues[interval],
                                  item: interval,
                                };
                              })}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="value">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!(meta.error && meta.touched)} className="mt-4">
                            <FormLabel
                              htmlFor="value"
                              className="flex items-center gap-1.5 mb-1 px-2 text-sm font-medium">
                              Credit Value&nbsp;
                              <CottageTooltip text="Subscribers to this plan will be given this amount in the form of credits. These credits can only be applied to orders." />
                            </FormLabel>
                            <NumberFormat
                              {...field}
                              id="value"
                              disabled={isEdit}
                              style={{ padding: '7px 16px' }}
                              className={
                                isEdit
                                  ? 'border-lightGreen-100 rounded-md w-full opacity-40 cursor-not-allowed'
                                  : 'border-lightGreen-100 rounded-md w-full'
                              }
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
                            Description <span className="text-gray-300">(optional)</span>
                          </FormLabel>
                          <Textarea {...field} id="description" size="md" width="full" />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="images">
                      {({ field, meta }: FieldProps) => (
                        <FormControl className="mt-4">
                          <FormLabel htmlFor="images" className="px-2 mb-1 text-sm font-medium">
                            Plan Image <span className="text-gray-300">(optional)</span>
                          </FormLabel>
                          <React.Fragment>
                            <input
                              ref={uploadImageButton}
                              onChange={(e) => handleImageSelect(e)}
                              type="file"
                              className="hidden"
                              // multiple={false}
                            />
                            <Button
                              className="h-8 text-sm font-semibold bg-softGreen-200 hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
                              style={{ width: '142px' }}
                              onClick={() => uploadImageButton.current?.click()}>
                              + Upload Image
                            </Button>
                          </React.Fragment>{' '}
                          {(values['images'] ? Array.from(values['images']) : []).map((img) =>
                            renderImagePreview(img[1], () => {
                              const map = values['images'] || new Map();
                              map.delete(img[0]);
                              setFieldValue('images', map);
                            })
                          )}
                        </FormControl>
                      )}
                    </Field>
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
                    onCancel={isEdit ? () => goBack(planId) : () => goBack()}
                    isEnabled={isValid}
                    buttonTitle={isEdit ? 'Save Plan' : 'Create Plan'}
                    isLoading={createPlan.isLoading || updatePlan.isLoading}
                  />
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
                    setFieldValue('images', new Map([[newFileUrl, img.url]]));

                    // TODO: for multiple we would do
                    // const map = values['images'] || new Map();
                    // map.set(img, img);
                    // setFieldValue('images', map);
                  }}
                  onClose={onClose}
                />
              </EditFormPopover>
              {/* End image crop modal */}
            </div>
          );
        }}
      </Formik>
      {fileSizeModalVisible && (
        <CottageInfoDialog
          title={'Image too large'}
          message={'Image size must be less than 2MB'}
          onClose={() => setFileSizeModalVisible(false)}
        />
      )}
    </>
  );
};

export default PlansForm;
