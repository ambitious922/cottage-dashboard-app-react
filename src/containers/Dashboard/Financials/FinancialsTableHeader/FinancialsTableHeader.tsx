import {
  Badge,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@heroicons/react/outline';
import { BalanceTransactionType, FilterBalanceTransactionsInput } from 'API';
import CottageFilterPopover from 'components/Common/CottageFilterPopover';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  FinancialsFilterFormValues,
  FinancialsFilterValidation,
  IFinancialsFilterFormValues,
} from '../FinancialsTableFiltersForm/FinancialsTableFiltersFormFields';

export interface IFinancialsTableHeaderProps {
  totalFinancials: number;
  setFilters: React.Dispatch<React.SetStateAction<FilterBalanceTransactionsInput>>;
}

interface BalanceTransactionTag {
  display: string;
  type: BalanceTransactionType;
}

const types: BalanceTransactionTag[] = [
  { display: 'Charge', type: BalanceTransactionType.CHARGE },
  { display: 'Refund', type: BalanceTransactionType.REFUND },
  { display: 'Payout', type: BalanceTransactionType.PAYOUT },
];

const FinancialsTableHeader: React.FC<IFinancialsTableHeaderProps> = ({
  totalFinancials,
  setFilters,
}) => {
  const submitFilters = (values: IFinancialsFilterFormValues) => {
    const {
      orderNumber,
      orderNumberCheckbox,
      subscriptionInvoiceNumber,
      subscriptionInvoiceNumberCheckbox,
      type,
      typeCheckbox,
    } = values;
    const filters: FilterBalanceTransactionsInput = {};
    filters.orderNumber = orderNumberCheckbox ? orderNumber : undefined;
    filters.subscriptionInvoiceNumber = subscriptionInvoiceNumberCheckbox
      ? subscriptionInvoiceNumber
      : undefined;
    filters.type = typeCheckbox ? type : undefined;
    setFilters(filters);
  };

  const countFilters = (values: IFinancialsFilterFormValues) => {
    let count = 0;
    const { orderNumberCheckbox, subscriptionInvoiceNumberCheckbox, typeCheckbox } = values;
    if (orderNumberCheckbox) {
      count++;
    }
    if (subscriptionInvoiceNumberCheckbox) {
      count++;
    }
    if (typeCheckbox) {
      count++;
    }
    return count;
  };

  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Showing {totalFinancials} {totalFinancials === 1 ? 'transaction' : 'transactions'}
      </div>
      <Formik
        initialValues={FinancialsFilterFormValues}
        onSubmit={(values) => submitFilters(values)}
        validationSchema={FinancialsFilterValidation}>
        {({ isValid, dirty, values, submitForm, resetForm }) => {
          return (
            <CottageFilterPopover
              selectedFilterCount={countFilters(values)}
              disabled={!(isValid && dirty)}
              handleApply={submitForm}
              clearFilters={resetForm}>
              <Form className="bg-white" style={{ minWidth: '100%' }}>
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
                <div className="mt-5">
                  <Field name="subscriptionInvoiceNumberCheckbox">
                    {({ field, meta, form }: FieldProps) => (
                      <Checkbox
                        name="subscriptionInvoiceNumberCheckbox"
                        borderColor="#235C48"
                        colorScheme="cottage-green"
                        isChecked={meta.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                        <Text className="font-sans text-sm font-medium">
                          Subscription Invoice Number
                        </Text>
                      </Checkbox>
                    )}
                  </Field>
                  {values.subscriptionInvoiceNumberCheckbox && (
                    <Field name="subscriptionInvoiceNumber">
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
                                name="subscriptionInvoiceNumber"
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
                  <Field name="typeCheckbox">
                    {({ field, meta, form }: FieldProps) => (
                      <Checkbox
                        borderColor="#235C48"
                        colorScheme="cottage-green"
                        isChecked={meta.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                        <Text className="font-sans text-sm font-medium">Type</Text>
                      </Checkbox>
                    )}
                  </Field>
                  {values.typeCheckbox && (
                    <Field name="type">
                      {({ field, meta, form }: FieldProps) => (
                        <div className="flex flex-col py-2 justify-start">
                          {types.map((t) => (
                            <div
                              key={t.type}
                              className="inline my-1 cursor-pointer"
                              onClick={() => {
                                form.setFieldValue(field.name, t.type);
                              }}>
                              <Badge
                                {...field}
                                key={t.type}
                                className="font-sans text-xs font-semibold"
                                paddingX="6px"
                                paddingY="4px"
                                borderRadius="6px"
                                color={t.type === meta.value ? '#102D29' : '#525D5F'}
                                bgColor={t.type === meta.value ? '#FFD8BF' : '#F8F7F7'}>
                                {t.display}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  )}
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

export default FinancialsTableHeader;
