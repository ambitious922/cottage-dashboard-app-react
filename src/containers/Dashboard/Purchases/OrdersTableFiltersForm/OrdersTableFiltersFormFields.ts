import { OrderStatus } from 'API';
import * as Yup from 'yup';

export interface IOrdersFilterFormValues {
  orderNumber: string | undefined;
  orderNumberCheckbox: boolean;
  email: string | undefined;
  emailCheckbox: boolean;
  status: OrderStatus | undefined;
  statusCheckbox: boolean;
}

export const OrdersFilterFormValues: IOrdersFilterFormValues = {
  orderNumber: undefined,
  orderNumberCheckbox: false,
  email: undefined,
  emailCheckbox: false,
  status: undefined,
  statusCheckbox: false,
};

export const OrdersFilterValidation = Yup.object().shape({
  orderNumber: Yup.string().min(0).max(20),
  email: Yup.string().email(),
  status: Yup.mixed().oneOf([
    OrderStatus.COMPLETED,
    OrderStatus.CONSUMER_CANCELED,
    OrderStatus.LOCATION_CANCELED,
    OrderStatus.PURCHASED,
  ]),
});
