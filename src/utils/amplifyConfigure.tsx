// eslint-disable-next-line
import Amplify from 'aws-amplify';

import config from 'config/config';

const configureAmplify = () => {
  // TODO: DISCUSS WHAT STAYS IN INDEX AND WHAT GOES TO APP
  console.log(
    JSON.stringify({
      Auth: {
        mandatorySignIn: false,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
      },
      Storage: {
        AWSS3: {
          bucket: config.s3.BUCKET,
          region: config.s3.REGION,
        },
      },
      API: {
        graphql_endpoint: config.apiGateway.URL,
        graphql_endpoint_iam_region: config.apiGateway.REGION,
      },
    })
  );
  Amplify.configure({
    Auth: {
      mandatorySignIn: false,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
    Storage: {
      AWSS3: {
        bucket: config.s3.BUCKET,
        region: config.s3.REGION,
      },
    },
    API: {
      graphql_endpoint: config.apiGateway.URL,
      graphql_endpoint_iam_region: config.apiGateway.REGION,
    },
  });
};
export default configureAmplify;
