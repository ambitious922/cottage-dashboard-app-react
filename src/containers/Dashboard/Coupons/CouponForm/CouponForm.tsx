import React, { useContext, useState } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Textarea,
  Box,
  useToast,
} from '@chakra-ui/react';

import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

import { CouponDuration, CouponType, CreateCouponInput, UpdateCouponInput } from 'API';
import Sidebar from 'components/Common/Sidebar';
import { AppContext } from 'App';
import { useHistory, useParams } from 'react-router';
import { Params } from 'constants/Routes';
import { CouponErrors } from 'models/error';

import {
  CreateCouponFormValidation,
  CreateCouponFormValues,
  CouponFormValues,
  CouponTypeDisplayValues,
  CouponDurationDisplayValues,
} from './CouponFormFields';
import ContainerHeader from 'components/Common/ContainerHeader';
import { useCreateCoupon, useGetCoupon, useUpdateCoupon } from 'api/query-hooks/coupon';
import CottageMapDropdown from 'components/Common/CottageMapDropdown';
import { enumKeys } from 'utils';

import NumberFormat from 'react-number-format';
import { errorToast } from 'components/Common/Toast';

export interface ICouponFormProps {
  couponId?: string;
  couponFormValues?: CouponFormValues;
}

const CouponForm: React.FC<ICouponFormProps> = ({ couponFormValues, couponId }) => {
  const { businessId } = useContext(AppContext);

  const { subdomain } = useParams<Params>();
  const [activeCouponId, setActiveCouponId] = useState('');
  const history = useHistory();
  const toast = useToast();

  const isEdit = !!couponFormValues;
  const pushToCoupons = () => history.push(`/business/${subdomain}/coupons`);
  const pushToCouponDetails = (id?: string) =>
    history.push(`/business/${subdomain}/coupons/${id || ''}`);

  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  // TODO figure out if there is a better way than this.
  // Without this the page will redirect and then update but first showing stale data
  // This prevents that but the issue is longer load time
  const getCoupon = useGetCoupon(
    { businessId, couponId: (isEdit ? couponId : activeCouponId) || '' },
    {
      enabled: !!activeCouponId,
      retry: false,
      onSettled: () => {
        pushToCouponDetails(activeCouponId);
      },
    }
  );

  const createCouponHelper = async (values: CouponFormValues) => {
    const castedValues = await CreateCouponFormValidation.validate(values);
    const { type, name, minimumTotal, description, amount, duration } = castedValues;

    const input: CreateCouponInput = {
      businessId,
      type,
      minimumTotal,
      name,
      description,
      duration,
    };
    if (type === CouponType.PERCENT_OFF) {
      input.percentOff = amount / 100;
      delete input.amountOff;
    } else if (type === CouponType.AMOUNT_OFF) {
      input.amountOff = amount;
      delete input.percentOff;
    }

    const res = await createCoupon.mutateAsync(input);
    setActiveCouponId(res.data?.createCoupon?.coupon?.id || '');
  };

  const updateCouponHelper = async (values: CouponFormValues) => {
    if (!couponId) {
      return;
    }

    const castedValues = await CreateCouponFormValidation.validate(values);
    const { type, minimumTotal, description, amount } = castedValues;

    const input: UpdateCouponInput = {
      businessId,
      couponId,
      minimumTotal,
      description,
    };
    if (type === CouponType.PERCENT_OFF) {
      input.percentOff = amount / 100;
      delete input.amountOff;
    } else if (type === CouponType.AMOUNT_OFF) {
      input.amountOff = amount;
      delete input.percentOff;
    }

    await updateCoupon.mutateAsync(input);
    setActiveCouponId(couponId);
  };

  const onSubmit = async (values: CouponFormValues) => {
    const valuesPostCentConversion = {
      ...values,
      amount:
        values.type === CouponType.AMOUNT_OFF
          ? values.amount
            ? Math.round(values.amount * 100)
            : undefined
          : values.amount
          ? values.amount
          : undefined,
      minimumTotal: values.minimumTotal ? Math.round(values.minimumTotal * 100) : undefined,
    };

    try {
      if (isEdit) {
        await updateCouponHelper(valuesPostCentConversion);
      } else {
        await createCouponHelper(valuesPostCentConversion);
      }
    } catch (e) {
      const exception = e?.errors[0];
      const code = exception.extensions?.code;
      let message;
      switch (code) {
        case CouponErrors.CouponLimitExceededErrorCode:
          message =
            'Coupon limit has been reached. Upgrade to premium to immediately increase your limit or reach out to us.';
          break;
        case CouponErrors.CouponDuplicateErrorCode:
          message = 'A coupon with this name already exists.';
          break;
        case CouponErrors.BusinessNotFoundErrorCode:
        case CouponErrors.CouponNotFoundErrorCode:
        default:
          message = 'Something went wrong';
          break;
      }
      errorToast(toast, message);
    }
  };

  const onBackClick = () => (isEdit && couponId ? pushToCouponDetails(couponId) : pushToCoupons());

  const initialAmount =
    couponFormValues?.type === CouponType.AMOUNT_OFF
      ? couponFormValues?.amount
        ? couponFormValues.amount / 100
        : undefined
      : couponFormValues?.amount
      ? couponFormValues?.amount
      : undefined;
  const initialMinTotal = couponFormValues?.minimumTotal
    ? couponFormValues?.minimumTotal / 100
    : undefined;
  const couponWithDollarsFormValues = couponFormValues
    ? { ...couponFormValues, amount: initialAmount, minimumTotal: initialMinTotal }
    : undefined;

  return (
    <Formik
      initialValues={couponWithDollarsFormValues || CreateCouponFormValues}
      onSubmit={(values) => onSubmit(values)}
      isInitialValid={isEdit}
      validationSchema={CreateCouponFormValidation}>
      {({ isValid, setFieldValue, values, submitForm, errors }) => {
        return (
          <div className="md:flex md:h-full">
            <div
              className="flex-grow px-2 py-2 md:px-7"
              style={{
                backgroundColor: '#E5E5E5',
              }}>
              <ContainerHeader
                headerText={isEdit ? 'Edit Coupon Code' : 'New Coupon Code'}
                onBackClick={onBackClick}
              />
              <Box
                className="items-center justify-center mx-auto mb-4"
                style={{ maxWidth: '670px' }}>
                <Form
                  className="px-6 pt-4 pb-8 my-0 bg-white border shadow-lg sm:my-8 border-outline-300 rounded-xl"
                  style={{ minWidth: '100%' }}>
                  <Heading as="h2" size="md" fontFamily="inherit" className="text-base font-medium">
                    Coupon Details
                  </Heading>
                  <Field name="name">
                    {({ field, meta }: FieldProps) => (
                      <FormControl isInvalid={!!(meta.error && meta.touched)} className="mt-4">
                        <FormLabel htmlFor="name" className="px-2 mb-1 text-sm font-medium">
                          Coupon Code
                        </FormLabel>
                        <Input
                          {...field}
                          id="name"
                          size="md"
                          width="100%"
                          className="border-lightGreen-100"
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-5 md:gap-4">
                    <Field name="type">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          className="col-span-2 mt-4"
                          isInvalid={!!(meta.error && meta.touched)}>
                          <FormLabel
                            htmlFor="type"
                            className="flex items-center gap-1.5 mb-1 px-2 text-sm font-medium">
                            Coupon Type
                          </FormLabel>
                          <CottageMapDropdown
                            isDisabled={isEdit}
                            value={{
                              display: CouponTypeDisplayValues[field.value as CouponType],
                              item: field.value as CouponType,
                            }}
                            onChange={(type) => {
                              setFieldValue(field.name, CouponType[type.item]);
                            }}
                            items={enumKeys(CouponType).map((type) => {
                              return {
                                display: CouponTypeDisplayValues[type],
                                item: type,
                              };
                            })}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    {values.type !== CouponType.FREE_DELIVERY && (
                      <Field name="amount">
                        {({ field, meta }: FieldProps) => (
                          <FormControl isInvalid={!!(meta.error && meta.touched)} className="mt-4">
                            <FormLabel htmlFor="amount" className="px-2 mb-1 text-sm font-medium">
                              {values.type === CouponType.AMOUNT_OFF ? 'Amount Off' : 'Percent Off'}
                            </FormLabel>
                            <NumberFormat
                              {...field}
                              id="amount"
                              style={{ padding: '7px 16px' }}
                              className="border-lightGreen-100 rounded-md w-full"
                              decimalSeparator="."
                              displayType="input"
                              type="text"
                              allowNegative={false}
                              decimalScale={2}
                              placeholder={values.type === CouponType.AMOUNT_OFF ? '$' : '%'}
                              fixedDecimalScale={values.type === CouponType.AMOUNT_OFF}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    )}
                  </div>
                  <Field name="description">
                    {({ field, meta }: FieldProps) => (
                      <FormControl className="mt-4" isInvalid={!!(meta.error && meta.touched)}>
                        <FormLabel htmlFor="description" className="px-2 mb-1 text-sm font-medium">
                          Description <span className="text-gray-300">(optional)</span>
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
                  <hr className="my-8 border-lightGrey" />
                  <Heading as="h2" size="md" fontFamily="inherit" className="text-base font-medium">
                    Coupon Rules
                  </Heading>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-5 md:gap-4">
                    <Field name="duration">
                      {({ field, meta }: FieldProps) => (
                        <FormControl
                          className="col-span-2 mt-4"
                          isInvalid={!!(meta.error && meta.touched)}>
                          <FormLabel
                            htmlFor="duration"
                            className="flex items-center gap-1.5 mb-1 px-2 text-sm font-medium">
                            Usage Limits
                          </FormLabel>
                          <CottageMapDropdown
                            isDisabled={isEdit}
                            value={{
                              display: CouponDurationDisplayValues[field.value as CouponDuration],
                              item: field.value as CouponDuration,
                            }}
                            onChange={(duration) => {
                              setFieldValue(field.name, CouponDuration[duration.item]);
                            }}
                            items={enumKeys(CouponDuration).map((duration) => {
                              return {
                                display: CouponDurationDisplayValues[duration],
                                item: duration,
                              };
                            })}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="minimumTotal">
                      {({ field, meta }: FieldProps) => (
                        <FormControl className="mt-4" isInvalid={!!(meta.error && meta.touched)}>
                          <FormLabel
                            htmlFor="minimumTotal"
                            className="px-2 mb-1 text-sm font-medium">
                            Min Purchase
                          </FormLabel>
                          <NumberFormat
                            {...field}
                            id="minimumTotal"
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

                  {/*
                   *** start hardcode for missing fields
                   */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-5 md:gap-4">
                    <Field name="valid_from">
                      {({ field, meta }: FieldProps) => (
                        <FormControl isInvalid={!!(meta.error && meta.touched)} className="mt-4">
                          <FormLabel htmlFor="valid_from" className="px-2 mb-1 text-sm font-medium">
                            Valid from <span className="text-gray-300">(optional)</span>
                          </FormLabel>
                          <Input
                            {...field}
                            type="date"
                            id="valid_from"
                            size="md"
                            width="full"
                            className="border-lightGreen-100"
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="expires_on">
                      {({ field, meta }: FieldProps) => (
                        <FormControl isInvalid={!!(meta.error && meta.touched)} className="mt-4">
                          <FormLabel htmlFor="expires_on" className="px-2 mb-1 text-sm font-medium">
                            Expires on <span className="text-gray-300">(optional)</span>
                          </FormLabel>
                          <Input
                            {...field}
                            type="date"
                            id="expires_on"
                            size="md"
                            width="full"
                            className="border-lightGreen-100"
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </div>
                  {/*
                   *** end hardcode for missing fields
                   */}
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
                  onCancel={isEdit ? () => pushToCouponDetails(couponId) : pushToCoupons}
                  isEnabled={isValid}
                  buttonTitle={isEdit ? 'Save Coupon' : 'Create Coupon'}
                  isLoading={
                    createCoupon.isLoading ||
                    updateCoupon.isLoading ||
                    getCoupon.isLoading ||
                    getCoupon.isFetching
                  }
                />
                <div className="mx-3.5 px-4 py-0">
                  <div
                    className="flex justify-between gap-4 p-3 rounded-lg"
                    style={{ background: '#FCF9E9' }}>
                    <div>
                      <QuestionMarkCircleIcon className="text-black h-7 w-7" />
                    </div>
                    <span className="text-sm text-gray-500">
                      Coupons are only considered after subtotal + delivery fees + taxes. Any
                      customer credits, granted by your or one of your plans, are applied
                      afterwards.
                    </span>
                  </div>
                </div>
              </Box>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default CouponForm;
