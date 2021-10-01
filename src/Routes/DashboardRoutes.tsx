import React from 'react';
import { DashboardPageRoutes } from 'constants/Routes';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Overview from 'containers/Dashboard/Overview';
import Purchases from 'containers/Dashboard/Purchases';
import Products from 'containers/Dashboard/Products';
import Plans from 'containers/Dashboard/Plans';
import Coupons from 'containers/Dashboard/Coupons';
import CreateCoupon from 'containers/Dashboard/Coupons/CreateCoupon';
import Financials from 'containers/Dashboard/Financials';
import Customers from 'containers/Dashboard/Customers';
import CustomerDetails from 'containers/Dashboard/Customers/CustomerDetails';
import Settings from 'containers/Dashboard/Settings';
// TODO this only works with .tsx ???
import CouponDetails from 'containers/Dashboard/Coupons/CouponDetails.tsx';
import EditCoupon from 'containers/Dashboard/Coupons/EditCoupon';
import DashboardNotFound from 'containers/DashboardNotFound';
import CreateProduct from 'containers/Dashboard/Products/CreateProduct';
import CreatePlan from 'containers/Dashboard/Plans/CreatePlan';
import EditPlan from 'containers/Dashboard/Plans/EditPlan';
import PlanDetails from 'containers/Dashboard/Plans/PlanDetails';
import ProductDetails from 'containers/Dashboard/Products/ProductDetails';
import EditProduct from 'containers/Dashboard/Products/EditProduct';

interface DashboardProps {}

type LocationType = {
  fromBanner?: boolean;
};

const DashboardRoutes: React.FC<DashboardProps> = () => {
  const location = useLocation<LocationType>();
  return (
    <Switch>
      <Route
        exact
        path={DashboardPageRoutes.ROOT}
        render={(props) => <Redirect to={`/business/${props.match.params.subdomain}/overview`} />}
      />
      <Route exact path={DashboardPageRoutes.OVERVIEW} component={Overview} />
      <Route exact path={DashboardPageRoutes.PURCHASES} component={Purchases} />

      {/* Product Routes */}
      <Route exact path={DashboardPageRoutes.PRODUCTS} component={Products} />
      <Route exact path={DashboardPageRoutes.PRODUCTS_NEW} component={CreateProduct} />
      <Route exact path={DashboardPageRoutes.PRODUCTS_DETAILS} component={ProductDetails} />
      <Route exact path={DashboardPageRoutes.PRODUCTS_EDIT} component={EditProduct} />

      {/* Plan Routes */}
      <Route exact path={DashboardPageRoutes.PLANS} component={Plans} />
      <Route exact path={DashboardPageRoutes.PLANS_NEW} component={CreatePlan} />
      <Route exact path={DashboardPageRoutes.PLANS_EDIT} component={EditPlan} />
      <Route exact path={DashboardPageRoutes.PLANS_DETAILS} component={PlanDetails} />

      {/* Coupon Routes */}
      <Route exact path={DashboardPageRoutes.COUPONS} component={Coupons} />
      <Route exact path={DashboardPageRoutes.COUPONS_NEW} component={CreateCoupon} />
      <Route exact path={DashboardPageRoutes.COUPONS_EDIT} component={EditCoupon} />
      <Route exact path={DashboardPageRoutes.COUPONS_DETAILS} component={CouponDetails} />

      <Route exact path={DashboardPageRoutes.FINANCIALS} component={Financials} />

      {/* Customer Routes */}
      <Route exact path={DashboardPageRoutes.CUSTOMERS} component={Customers} />
      <Route exact path={DashboardPageRoutes.CUSTOMERS_DETAILS} component={CustomerDetails} />

      <Route
        exact
        path={DashboardPageRoutes.SETTINGS}
        render={() => <Settings fromBanner={location.state?.fromBanner} />}
      />

      <Route component={DashboardNotFound} />
    </Switch>
  );
};
export default DashboardRoutes;
