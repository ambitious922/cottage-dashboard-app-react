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
import { SearchIcon } from '@heroicons/react/solid';
import {
  FilterPlansInput,
  FilterSubscriptionInvoicesInput,
  GetBusinessInput,
  InvoiceStatus,
  PlanStatus,
} from 'API';
import { useGetBusinessPlans } from 'api/query-hooks/plans';
import { AppContext } from 'App';
import CottageFilterPopover from 'components/Common/CottageFilterPopover';
import CottageMapDropdown from 'components/Common/CottageMapDropdown';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useContext } from 'react';
import {
  ISubscriptionInvoicesFilterFormValues,
  SubscriptionInvoicesFilterFormValues,
  SubscriptionInvoicesFilterValidation,
} from '../SubscriptionsTableFiltersForm/SubscriptionsTableFiltersFormFields';

export interface ISubscriptionTableHeaderProps {
  totalSubscriptionInvoices: number;
  setFilters: React.Dispatch<React.SetStateAction<FilterSubscriptionInvoicesInput>>;
}

interface IInvoiceStatusTag {
  title: string;
  status: InvoiceStatus;
}

const statuses: IInvoiceStatusTag[] = [
  { title: 'Paid', status: InvoiceStatus.PAID },
  { title: 'Void', status: InvoiceStatus.VOID },
  { title: 'Open', status: InvoiceStatus.OPEN },
  { title: 'Uncollectible', status: InvoiceStatus.UNCOLLECTIBLE },
];

interface IPlanOption {
  planId: string;
  planTitle: string;
}

const SubscriptionTableHeader: React.FC<ISubscriptionTableHeaderProps> = ({
  totalSubscriptionInvoices,
  setFilters,
}) => {
  const { businessId } = useContext(AppContext);

  const businessInput: GetBusinessInput = { businessId };
  const filters: FilterPlansInput = {
    status: PlanStatus.ACTIVE,
  };

  const businessPlansQuery = useGetBusinessPlans(businessInput, filters, {});

  const plansOptions: IPlanOption[] =
    businessPlansQuery.data?.data?.getBusiness?.plans?.edges.map((e) => {
      return {
        planId: e.node.id,
        planTitle: e.node.title,
      };
    }) || [];

  const submitFilters = (values: ISubscriptionInvoicesFilterFormValues) => {
    const {
      invoiceNumber,
      invoiceNumberCheckbox,
      email,
      emailCheckbox,
      status,
      statusCheckbox,
      planCheckbox,
      planId,
    } = values;
    const filters: FilterSubscriptionInvoicesInput = {};
    filters.invoiceNumber = invoiceNumberCheckbox && invoiceNumber ? invoiceNumber : undefined;
    filters.consumerEmail = emailCheckbox && email ? email : undefined;
    filters.invoiceStatuses = statusCheckbox && status ? [status] : undefined;
    filters.planId = planCheckbox && planId ? planId : undefined;
    setFilters(filters);
  };

  const countFilters = (values: ISubscriptionInvoicesFilterFormValues) => {
    let count = 0;
    const { invoiceNumberCheckbox, emailCheckbox, statusCheckbox, planCheckbox } = values;
    if (invoiceNumberCheckbox) {
      count++;
    }
    if (emailCheckbox) {
      count++;
    }
    if (statusCheckbox) {
      count++;
    }
    if (planCheckbox) {
      count++;
    }
    return count;
  };

  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {`${totalSubscriptionInvoices}`}{' '}
        {totalSubscriptionInvoices === 1 ? 'invoice' : 'invoices'}
      </div>
      {/* TODO: date range picker compoment */}
      <Formik
        initialValues={SubscriptionInvoicesFilterFormValues}
        onSubmit={(values) => submitFilters(values)}
        validationSchema={SubscriptionInvoicesFilterValidation}>
        {({ isValid, dirty, values, submitForm, resetForm, setFieldValue, errors }) => {
          return (
            <CottageFilterPopover
              selectedFilterCount={countFilters(values)}
              disabled={!(isValid && dirty)}
              handleApply={submitForm}
              clearFilters={resetForm}>
              <Form className="bg-white" style={{ minWidth: '100%' }}>
                <div>
                  <Field name="invoiceNumberCheckbox">
                    {({ field, meta, form }: FieldProps) => (
                      <Checkbox
                        name="invoiceNumberCheckbox"
                        borderColor="#235C48"
                        colorScheme="cottage-green"
                        isChecked={meta.value}
                        onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                        <Text className="font-sans text-sm font-medium">Invoice #</Text>
                      </Checkbox>
                    )}
                  </Field>
                  {values.invoiceNumberCheckbox && (
                    <Field name="invoiceNumber">
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
                                name="invoiceNumber"
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
                        <Text className="font-sans text-sm font-medium">Invoice Status</Text>
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
                {businessPlansQuery.isSuccess && (
                  <div className="mt-5">
                    <Field name="planCheckbox">
                      {({ field, meta, form }: FieldProps) => (
                        <Checkbox
                          borderColor="#235C48"
                          colorScheme="cottage-green"
                          isChecked={meta.value}
                          onChange={(e) => form.setFieldValue(field.name, e.target.checked)}>
                          <Text className="font-sans text-sm font-medium">Plan</Text>
                        </Checkbox>
                      )}
                    </Field>
                    {values.planCheckbox && (
                      <Field name="planId">
                        {({ field, meta, form }: FieldProps) => (
                          <div className="flex flex-col py-2 justify-start">
                            <CottageMapDropdown
                              isDisabled={businessPlansQuery.isLoading}
                              value={{
                                display:
                                  plansOptions.find((po) => po.planId === field.value)?.planTitle ||
                                  '',
                                item: field.value as string,
                              }}
                              onChange={(po) => {
                                setFieldValue(field.name, po.item);
                              }}
                              items={plansOptions.map((po) => {
                                return {
                                  display: po.planTitle,
                                  item: po.planId,
                                };
                              })}
                            />
                          </div>
                        )}
                      </Field>
                    )}
                  </div>
                )}
              </Form>
              <hr className="pb-3 mt-5" />
            </CottageFilterPopover>
          );
        }}
      </Formik>
    </div>
  );
};

export default SubscriptionTableHeader;
