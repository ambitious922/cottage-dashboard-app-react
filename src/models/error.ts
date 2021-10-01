export enum AmplifyErrors {
  CodeMismatchException = 'CodeMismatchException',
  ExpiredCodeException = 'ExpiredCodeException',
  TooManyFailedAttemptsException = 'TooManyFailedAttemptsException',
  TooManyRequestsException = 'TooManyRequestsException',
  UsernameExistsException = 'UsernameExistsException',
  UserNotConfirmedException = 'UserNotConfirmedException',
  UserNotFoundException = 'UserNotFoundException',
  NotAuthorizedException = 'NotAuthorizedException',
}

/** errors coming from the backend service */

export enum BankAccountErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  StripeInvalidAccountErrorCode = 'STRIPE_INVALID_ACCOUNT_ERROR',
}

export enum BusinessErrors {
  BusinessLevelDowngradeErrorCode = 'BUSINESS_LEVEL_DOWNGRADE_ERROR',
  BusinessLimitExceededErrorCode = 'BUSINESS_LIMIT_EXCEEDED_ERROR',
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  DuplicateSubdomainErrorCode = 'DUPLICATE_SUBDOMAIN_ERROR',
  // trying to downgrade from premium to standard
  InvalidStateTransitionErrorCode = 'INVALID_STATE_TRANSITION_ERROR',
}

export enum ConsumerErrors {
  AccessForbiddenErrorCode = 'ACCESS_FORBIDDEN_ERROR',
  ConsumerNotFoundErrorCode = 'CONSUMER_NOT_FOUND_ERROR',
}

export enum CouponErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  CouponNotFoundErrorCode = 'COUPON_NOT_FOUND_ERROR',
  CouponDuplicateErrorCode = 'COUPON_DUPLICATE_ERROR',
  CouponLimitExceededErrorCode = 'COUPON_LIMIT_EXCEEDED_ERROR',
}

export enum CreditErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  ConsumerNotFoundErrorCode = 'CONSUMER_NOT_FOUND_ERROR',
  ConsumerUpdateCreditBalanceRetryErrorCode = 'CONSUMER_UPDATE_CREDIT_BALANCE_RETRY_ERROR',
  CreditAmountInvalidErrorCode = 'CREDIT_AMOUNT_INVALID_ERROR',
}

export enum DeliveryErrors {
  DeliveryLimitExceededErrorCode = 'DELIVERY_LIMIT_EXCEEDED_ERROR',
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  DeliveryNotFoundErrorCode = 'DELIVERY_NOT_FOUND_ERROR',
  LocationNotFoundErrorCode = 'LOCATION_NOT_FOUND_ERROR',
}

export enum LocationErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  LocationNotFoundErrorCode = 'LOCATION_NOT_FOUND_ERROR',
  LocationLimitExceededErrorCode = 'LOCATION_LIMIT_EXCEEDED_ERROR',
  DuplicatePathSegmentErrorCode = 'DUPLICATE_PATH_SEGMENT_ERROR',
}

export enum OrderErrors {
  BusinessNotActiveErrorCode = 'BUSINESS_NOT_ACTIVE_ERROR',
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  ExportEmptyErrorCode = 'EXPORT_EMPTY_ERROR',
  LocationNotFoundErrorCode = 'LOCATION_NOT_FOUND_ERROR',
  OrderNotFoundErrorCode = 'ORDER_NOT_FOUND_ERROR',
  OrderStatusInvalidError = 'ORDER_STATUS_INVALID_ERROR',
}

export enum PickupLocationErrors {
  PickupLocationExceededErrorCode = 'PICKUP_LOCATION_LIMIT_EXCEEDED_ERROR',
  PickupAddressNotFoundErrorCode = 'PICKUP_ADDRESS_NOT_FOUND_ERROR',
}

export enum PlanErrors {
  PlanLimitExceededErrorCode = 'PLAN_LIMIT_EXCEEDED_ERROR',
  PlanNotFoundErrorCode = 'PLAN_NOT_FOUND_ERROR',
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
}

export enum ProductErrors {
  AccessForbiddenErrorCode = 'ACCESS_FORBIDDEN_ERROR',
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  ProductLimitExceededErrorCode = 'PRODUCT_LIMIT_EXCEEDED_ERROR',
}

export enum ProductCategoryErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  ProductCategoryDuplicateErrorCode = 'PRODUCT_CATEGORY_DUPLICATE_ERROR',
  ProductCategoryLimitErrorCode = 'PRODUCT_CATEGORY_LIMIT_EXCEEDED_ERROR',
  ProductCategoryNotFoundErrorCode = 'PRODUCT_CATEGORY_NOT_FOUND_ERROR',
}

export enum ProductTagErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  ProductTagDuplicateErrorCode = 'PRODUCT_TAG_DUPLICATE_ERROR',
  ProductTagLimitErrorCode = 'PRODUCT_TAG_LIMIT_EXCEEDED_ERROR',
  ProductTagNotFoundErrorCode = 'PRODUCT_TAG_NOT_FOUND_ERROR',
}

export enum RefundErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  ConsumerNotFoundErrorCode = 'CONSUMER_NOT_FOUND_ERROR',
  LocationNotFoundErrorCode = 'LOCATION_NOT_FOUND_ERROR',
  OrderNotFoundErrorCode = 'ORDER_NOT_FOUND_ERROR',
  OrderNotPaidErrorCode = 'ORDER_NOT_PAID_ERROR',
  RefundAmountExceededErrorCode = 'REFUND_AMOUNT_EXCEEDED_ERROR',
}

export enum SusbcriptionErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  SubscriptionNotFoundError = 'SUBSCRIPTION_NOT_FOUND_ERROR',
}

export enum TaxRateErrors {
  BusinessNotFoundErrorCode = 'BUSINESS_NOT_FOUND_ERROR',
  LocationNotFoundErrorCode = 'LOCATION_NOT_FOUND_ERROR',
}
