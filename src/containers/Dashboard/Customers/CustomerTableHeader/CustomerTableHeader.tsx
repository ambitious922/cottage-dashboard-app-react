import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@heroicons/react/outline';
import { FilterConsumersInput } from 'API';
import CottageFilterPopover from 'components/Common/CottageFilterPopover';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useEffect } from 'react';
import {
  CustomerFilterFormValues,
  CustomerFilterValidation,
  ICustomerFilterFormValues,
} from '../CustomerTableFiltersForm/CustomerTableFiltersFormFields';

export interface ICustomerTableHeaderProps {
  totalCustomers: number;
  activeTab: string;
  setFilters: React.Dispatch<React.SetStateAction<FilterConsumersInput>>;
}

const CustomerTableHeader: React.FC<ICustomerTableHeaderProps> = ({
  totalCustomers,
  activeTab,
  setFilters,
}) => {
  // clears the filters when the tab is switched
  useEffect(() => {
    setFilters({});
  }, [activeTab]);

  const submitFilters = (values: ICustomerFilterFormValues) => {
    const filters: FilterConsumersInput = {};
    filters.email = values.emailCheckbox ? values.email : undefined;
    setFilters(filters);
  };

  const countFilters = (values: ICustomerFilterFormValues) => {
    let count = 0;
    if (values.emailCheckbox) {
      count++;
    }
    return count;
  };

  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {totalCustomers} {activeTab.toLowerCase()}{' '}
        {totalCustomers === 1 ? 'customer' : 'customers'}
      </div>
      <Formik
        initialValues={CustomerFilterFormValues}
        onSubmit={(values) => submitFilters(values)}
        validationSchema={CustomerFilterValidation}>
        {({ isValid, dirty, values, submitForm, resetForm }) => {
          return (
            <CottageFilterPopover
              selectedFilterCount={countFilters(values)}
              disabled={!(isValid && dirty)}
              handleApply={submitForm}
              clearFilters={resetForm}>
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
                              children={<SearchIcon color="#CFD5D4" className="w-5 h-5 mt-3.5" />}
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
              <hr className="pb-3 mt-5" />
            </CottageFilterPopover>
          );
        }}
      </Formik>
    </div>
  );
};

export default CustomerTableHeader;
