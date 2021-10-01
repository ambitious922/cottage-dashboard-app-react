export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: process.env.REACT_APP_REGION,
    BUCKET: `cottage-${process.env.REACT_APP_STAGE}-attachments`,
  },
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL:
      process.env.REACT_APP_STAGE === 'local'
        ? 'http://localhost:4001/graphql'
        : `https://${process.env.REACT_APP_API_GATEWAY_IDENTIFIER}.execute-api.${process.env.REACT_APP_REGION}.amazonaws.com/${process.env.REACT_APP_STAGE}/graphql`,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
  stripe: {
    PUBLISHER_KEY: process.env.REACT_APP_STRIPE_PUBLISHER_KEY,
  },
  google: {
    PLACES_API_KEY: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
  },
};
