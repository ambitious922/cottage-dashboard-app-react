import React, { useContext, useEffect, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';
import { RouteComponentProps, useHistory, useLocation } from 'react-router';
import { Route, Switch, withRouter } from 'react-router-dom';
import { PageRoutes } from 'constants/Routes';
import Home from '../containers/Home';
import Auth from '../containers/Auth';
import DashboardNotFound from 'containers/DashboardNotFound';
import OnboardingForm from 'containers/Onboarding/OnboardingForm';
import { AppContext } from 'App';
import { getUserCredentials } from 'api/auth';
import { useGetProducerBusiness } from 'api/query-hooks/producer';
import { getProducerAndBusinessQuery } from 'API';
import BusinessDashboard from 'containers/Dashboard/BusinessDashboard';
import LocationDashboard from 'containers/Dashboard/LocationDashboard';

type LocationType = {
  fromForgotPassword: boolean;
  email: string;
};

const Routes: React.FC<RouteComponentProps> = () => {
  const appContext = useContext(AppContext);
  const location = useLocation<LocationType>();
  const [identityId, setIdentityId] = useState<string | undefined>(undefined);
  const history = useHistory();
  const getProducerBusinessQuery = useGetProducerBusiness(
    { id: identityId },
    {
      enabled: !!identityId,
      retry: false,
      onSettled: (data, errors: any) => {
        if (!data?.data?.producer || errors) {
          // not in the user table, send them to sign in
          history.push(PageRoutes.SIGN_IN);
          return;
        }

        const producer = data.data.producer;
        appContext.setProducerId(producer.id);

        if (producer.business?.id) {
          appContext.setBusinessId(producer.business.id);
        } else {
          // they dont have a business yet, send them to onboarding
          history.push(PageRoutes.ONBOARDING);
          return;
        }
      },
    }
  );

  // Very first step of the app is conducted here, talk to cognito.
  useEffect(() => {
    const fetchCreds = async () => {
      const creds = await getUserCredentials();
      setIdentityId(creds.identityId);
    };
    fetchCreds();
  }, []);

  // TODO Ask kevin why he put isIdle
  if (getProducerBusinessQuery.isIdle || getProducerBusinessQuery.isLoading) {
    return <></>;
  }

  return (
    <Switch>
      <Route exact path={PageRoutes.HOME} component={Home} />
      {/* TODO Redirect signin / signup(?) if the user is logged in, aka dont let user hardcode to sign_in route */}
      <Route exact path={PageRoutes.SIGN_IN} component={Auth} />
      <Route exact path={PageRoutes.SIGN_UP} component={Auth} />
      <Route exact path={PageRoutes.CONFIRM_SIGN_UP} component={Auth} />
      <Route exact path={PageRoutes.FORGOT_PASSWORD} component={Auth} />
      <Route
        exact
        path={PageRoutes.RESET_PASSWORD}
        render={() => (
          <Auth
            fromForgotPassword={location.state?.fromForgotPassword}
            email={location.state?.email}
          />
        )}
      />
      <Route exact path={PageRoutes.ONBOARDING} component={OnboardingForm} />
      {/* use react router to identify if we are on a location level dashboard page */}
      <Route path={PageRoutes.LOCATION_DASHBOARD} component={LocationDashboard} />
      <Route path={PageRoutes.DASHBOARD} component={BusinessDashboard} />

      {/* TODO Should ProcessingOrder be a component/route or just a modal/popup/spinner? */}
      <Route exact path={PageRoutes.NOT_FOUND} component={DashboardNotFound} />

      {/* Catch all unmatched routes */}
      <Route component={DashboardNotFound} />
    </Switch>
  );
};
export default withRouter(Routes);
