import { QueryKey } from 'react-query';

export enum QueryKeys {
  // Business related
  BUSINESS = 'business',
  BUSINESS_BALANCE_TRANSACTIONS = 'business_balance_transactions',
  BUSINESS_COUPONS = 'business_coupons',
  BUSINESS_LOCATIONS = 'business_locations',
  BUSINESS_LOCATIONS_OVERVIEW = 'business_locations_overview',
  BUSINESS_ORDERS = 'business_orders',
  BUSINESS_PLANS = 'business_plans',
  BUSINESS_PRODUCTS = 'business_products',
  BUSINESS_SETTINGS = 'business_settings',
  BUSINESS_SUBSCRIPTION_INVOICE = 'business_subscription_invoice',

  // Consumer
  CONSUMER = 'consumer',
  CONSUMER_TRANSACTIONS = 'consumer_transactions',
  CONSUMER_SUBSCRIPTIONS = 'consumer_subscriptions',

  // Credit
  CREDIT = 'credit',

  PRODUCER = 'producer',
  PRODUCER_BUSINESS = 'producer_business',

  // Coupon
  COUPON = 'coupon',
  CREATE_ACCOUNT_LINK = 'create_account_link',
  COUPON_ORDERS = 'coupon_orders',
  COUPON_LOCATIONS = 'coupon_locations',

  // Order
  ORDER = 'order',
  EXPORT_ORDERS = 'export_orders',

  // Pickup Address
  PICKUP_ADDRESS = 'pickup_address',

  // Plan
  PLAN = 'plan',
  PLAN_IMAGES = 'plan_images',
  PLAN_SUBSCRIPTIONS = 'plan_subscriptions',
  PLAN_LOCATIONS = 'plan_locations',
  PLAN_LOCATIONS_STATISTICS = 'plan_locations_statistics',

  // Product
  PRODUCT = 'product',
  PRODUCT_CATEGORY = 'product_category',
  PRODUCT_TAG = 'product_tag',
  PRODUCT_IMAGES = 'product_images',

  // Refund
  REFUND = 'refund',

  // Subscription Invoice
  SUBSCRIPTION_INVOICE = 'subscription_invoice',

  // Location
  LOCATION = 'location',
  LOCATION_COUPONS = 'location_coupons',
  LOCATION_DELIVERIES = 'location_deliveries',
  LOCATION_ORDERS = 'location_orders',
  LOCATION_OVERVIEW_ORDERS = 'location_overview_orders',
  LOCATION_PICKUP_ADDRESSES = 'location_pickup_addresses',
  LOCATION_PLANS = 'location_plans',
  LOCATION_FULFILLMENT = 'location_fulfillment',
}

export interface QueryFnProps<InputType, FilterType = void> {
  queryKey: [QueryKeys, InputType, FilterType?] | any;
}

// Refer to useMutation docs
export interface MutationOptions {
  mutationKey?: string;
  // onMutate: (variables: TVariables) => Promise<TContext | void> | TContext | void
  // onSuccess: (data: any, variables: any, context?: any) => Promise<unknown> | void
  // onError: (err: TError, variables: TVariables, context?: TContext) => Promise<unknown> | void
  // onSettled: (
  //   data: TData,
  //   error: TError,
  //   variables: TVariables,
  //   context?: TContext
  // ) => Promise<unknown> | void;
  retry?: boolean | number | ((failureCount: number, error: any) => boolean);
  retryDelay?: number | ((retryAttempt: number, error: any) => number);
  useErrorBoundary?: boolean;
}
