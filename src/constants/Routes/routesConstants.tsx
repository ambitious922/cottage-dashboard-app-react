export enum PageRoutes {
  NOT_FOUND = '/not_found',
  HOME = '/',
  SIGN_IN = '/signin',
  SIGN_UP = '/signup',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  ONBOARDING = '/onboarding',
  LOCATION_DASHBOARD = '/business/:subdomain/location/:pathSegment',
  DASHBOARD = '/business/:subdomain',
  CONFIRM_SIGN_UP = '/confirm-signup',
}

export enum DashboardPageRoutes {
  ROOT = '/business/:subdomain',
  OVERVIEW = '/business/:subdomain/overview',
  PURCHASES = '/business/:subdomain/purchases',
  PRODUCTS = '/business/:subdomain/products',
  PRODUCTS_NEW = '/business/:subdomain/products/new',
  PRODUCTS_DETAILS = '/business/:subdomain/products/:productId',
  PRODUCTS_EDIT = '/business/:subdomain/products/:productId/edit',
  PLANS = '/business/:subdomain/plans',
  PLANS_NEW = '/business/:subdomain/plans/new',
  PLANS_EDIT = '/business/:subdomain/plans/:planId/edit',
  PLANS_DETAILS = '/business/:subdomain/plans/:planId',
  FINANCIALS = '/business/:subdomain/financials',
  CUSTOMERS = '/business/:subdomain/customers',
  CUSTOMERS_DETAILS = '/business/:subdomain/customers/:customerId',
  SETTINGS = '/business/:subdomain/settings',
  LOCATION = '/business/:subdomain/location/:pathSegment',
  COUPONS = '/business/:subdomain/coupons',
  COUPONS_NEW = '/business/:subdomain/coupons/new',
  COUPONS_DETAILS = '/business/:subdomain/coupons/:couponId',
  COUPONS_EDIT = '/business/:subdomain/coupons/:couponId/edit',
}

export enum LocationDashboardPageRoutes {
  OVERVIEW = '/business/:subdomain/location/:pathSegment/overview',
  ORDERS = '/business/:subdomain/location/:pathSegment/orders',
  SCHEDULES = '/business/:subdomain/location/:pathSegment/schedules',
  COUPONS = '/business/:subdomain/location/:pathSegment/coupons',
  PLANS = '/business/:subdomain/location/:pathSegment/plans',
  PICKUP_DELVERY = '/business/:subdomain/location/:pathSegment/transportation/:transportationType',
  SETTINGS = '/business/:subdomain/location/:pathSegment/settings',
}

export interface Params {
  subdomain: string;
  pathSegment?: string;
}
