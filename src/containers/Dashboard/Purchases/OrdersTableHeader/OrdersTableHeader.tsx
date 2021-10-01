import {
  Badge,
  Checkbox,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { SearchIcon } from '@heroicons/react/outline';
import { FilterOrdersInput, OrderStatus } from 'API';
import CottageFilterPopover from 'components/Common/CottageFilterPopover';
import { Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';
import {
  IOrdersFilterFormValues,
  OrdersFilterFormValues,
  OrdersFilterValidation,
} from '../OrdersTableFiltersForm/OrdersTableFiltersFormFields';
export interface IOrdersTableHeaderProps {
  totalOrders: number;
  setFilters: React.Dispatch<React.SetStateAction<FilterOrdersInput>>;
}

interface OrderStatusTag {
  title: string;
  status: OrderStatus;
}

const statuses: OrderStatusTag[] = [
  { title: 'Purchased', status: OrderStatus.PURCHASED },
  { title: 'Completed', status: OrderStatus.COMPLETED },
  { title: 'Location Cancelled', status: OrderStatus.LOCATION_CANCELED },
  { title: 'Consumer Cancelled', status: OrderStatus.CONSUMER_CANCELED },
];

const OrdersTableHeader: React.FC<IOrdersTableHeaderProps> = ({ totalOrders, setFilters }) => {
  const submitFilters = (values: IOrdersFilterFormValues) => {
    const { orderNumber, orderNumberCheckbox, email, emailCheckbox, status, statusCheckbox } =
      values;
    const filters: FilterOrdersInput = {};
    filters.orderNumber = orderNumberCheckbox && orderNumber ? orderNumber : undefined;
    filters.consumerEmail = emailCheckbox && email ? email : undefined;
    filters.statuses = statusCheckbox && status ? [status] : undefined;
    setFilters(filters);
  };

  const countFilters = (values: IOrdersFilterFormValues) => {
    let count = 0;
    const { orderNumberCheckbox, emailCheckbox, statusCheckbox } = values;
    if (orderNumberCheckbox) {
      count++;
    }
    if (emailCheckbox) {
      count++;
    }
    if (statusCheckbox) {
      count++;
    }
    return count;
  };

  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {`${totalOrders}`} {totalOrders === 1 ? 'order' : 'orders'}
      </div>
      <div>{/* TODO: date range picker compoment */}</div>
      <Formik
        initialValues={OrdersFilterFormValues}
        onSubmit={(values) => submitFilters(values)}
        validationSchema={OrdersFilterValidation}>
        {({ isValid, dirty, values, submitForm, resetForm, errors }) => {
          return (
            <CottageFilterPopover
              selectedFilterCount={countFilters(values)}
              disabled={!(isValid && dirty)}
              handleApply={submitForm}
              clearFilters={resetForm}>
              <Form className="bg-white" style={{ minWidth: '100%' }}>
                <div>
                  <Field name="orderNumberCheckbox">
                    {({ field, meta, form }: FieldProps) => (
                      <Checkbox
                        name="orderNumberCheckbox"
                        borderColor="#235C48"
                        colorScheme="cottage-green"
                        isChecked={meta.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                        <Text className="font-sans text-sm font-medium">Order #</Text>
                      </Checkbox>
                    )}
                  </Field>
                  {values.orderNumberCheckbox && (
                    <Field name="orderNumber">
                      {({ field, meta, form }: FieldProps) => (
                        <div className="flex justify-start">
                          <FormControl isInvalid={!!(meta.touched && meta.error)}>
                            <InputGroup>
                              <InputLeftElement
                                pointerEvents="none"
                                children={<SearchIcon color="#CFD5D4" className="w-5 h-5 mt-3.5" />}
                              />
                              <Input
                                {...field}
                                name="orderNumber"
                                value={meta.value}
                                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                type="text"
                                className="w-full mt-2 font-sans text-sm font-normal text-darkGreen"
                                borderColor="#D2E3D5"
                                borderRadius="4px"
                                height="36px"
                                placeholder=""
                              />
                            </InputGroup>
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        </div>
                      )}
                    </Field>
                  )}
                </div>
                <div className="mt-5">
                  <Form className="bg-white" style={{ minWidth: '100%' }}>
                    <Field name="emailCheckbox">
                      {({ field, meta, form }: FieldProps) => (
                        <Checkbox
                          name="emailCheckbox"
                          borderColor="#235C48"
                          colorScheme="cottage-green"
                          isChecked={meta.value}
                          onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                          <Text className="font-sans text-sm font-medium">Email</Text>
                        </Checkbox>
                      )}
                    </Field>
                    {values.emailCheckbox && (
                      <Field name="email">
                        {({ field, meta, form }: FieldProps) => (
                          <div className="flex justify-start">
                            <FormControl isInvalid={!!(meta.touched && meta.error)}>
                              <InputGroup>
                                <InputLeftElement
                                  pointerEvents="none"
                                  children={
                                    <SearchIcon color="#CFD5D4" className="w-5 h-5 mt-3.5" />
                                  }
                                />
                                <Input
                                  {...field}
                                  name="email"
                                  type="text"
                                  className="w-full mt-2 font-sans text-sm font-normal text-darkGreen"
                                  borderColor="#D2E3D5"
                                  borderRadius="4px"
                                  height="36px"
                                  placeholder=""
                                  value={meta.value}
                                  onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                />
                              </InputGroup>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          </div>
                        )}
                      </Field>
                    )}
                  </Form>
                </div>
                <div className="mt-5">
                  <Field name="statusCheckbox">
                    {({ field, meta, form }: FieldProps) => (
                      <Checkbox
                        borderColor="#235C48"
                        colorScheme="cottage-green"
                        isChecked={meta.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                        <Text className="font-sans text-sm font-medium">Order Status</Text>
                      </Checkbox>
                    )}
                  </Field>
                  {values.statusCheckbox && (
                    <Field name="status">
                      {({ field, meta, form }: FieldProps) => (
                        <div className="flex flex-col py-2 justify-start">
                          {statuses.map((s) => (
                            <div
                              key={s.title}
                              className="inline my-1 cursor-pointer"
                              onClick={() => {
                                form.setFieldValue(field.name, s.status);
                              }}>
                              <Badge
                                {...field}
                                key={s.title}
                                className="font-sans text-xs font-semibold"
                                paddingX="6px"
                                paddingY="4px"
                                borderRadius="6px"
                                color={s.status === meta.value ? '#102D29' : '#525D5F'}
                                bgColor={s.status === meta.value ? '#FFD8BF' : '#F8F7F7'}>
                                {s.title}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  )}
                </div>
                <div className="mt-5">
                  <Field name="scheduleCheckbox">
                    {({ field, meta, form }: FieldProps) => (
                      <Checkbox
                        borderColor="#235C48"
                        colorScheme="cottage-green"
                        isChecked={meta.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                        <Text className="font-sans text-sm font-medium">Schedule</Text>
                      </Checkbox>
                    )}
                  </Field>
                </div>
              </Form>
              <hr className="pb-3 mt-5" />
            </CottageFilterPopover>
          );
        }}
      </Formik>
    </div>
  );
};

export default OrdersTableHeader;
