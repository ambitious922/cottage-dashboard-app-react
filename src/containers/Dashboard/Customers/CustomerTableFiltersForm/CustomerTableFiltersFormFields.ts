import * as Yup from 'yup';

export interface ICustomerFilterFormValues {
  email: string | undefined;
  emailCheckbox: boolean;
}

export const CustomerFilterFormValues: ICustomerFilterFormValues = {
  email: undefined,
  emailCheckbox: false,
};

export const CustomerFilterValidation = Yup.object().shape({
  email: Yup.string().email(),
});
