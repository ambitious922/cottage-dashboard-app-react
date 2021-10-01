import { Auth } from 'aws-amplify';
import { useQuery } from 'react-query';

export const signIn = async (username: string, password: string) =>
  await Auth.signIn({ username, password });

export const getUserCredentials = async () => await Auth.currentUserCredentials();

export const signUp = async (
  username: string,
  password: string,
  firstName: string,
  lastName: string
) =>
  await Auth.signUp({
    username,
    password,
    attributes: { 'custom:firstName': firstName, 'custom:lastName': lastName },
  });

export const getAttribute = async (attribute: string) => {
  const currentUserInfo = await Auth.currentUserInfo();
  return currentUserInfo.attributes[attribute];
};

export const getCurrentUserInfo = async () => {
  const userInfo = await Auth.currentUserInfo();
  return userInfo;
};

export const signOut = async () => await Auth.signOut();

export const resendCode = async (email: string) => await Auth.resendSignUp(email);

// takes an email and sends a code
export const forgotPassword = async (email: string) => await Auth.forgotPassword(email);

// leverages the code sent to customer's email and provides ability to reset the password
export const resetPassword = async (email: string, password: string, code: string) =>
  await Auth.forgotPasswordSubmit(email, code, password);

export const confirmSignUp = async (email: string, confirmationCode: string) =>
  await Auth.confirmSignUp(email, confirmationCode);

export const useGetUserCredentials = () =>
  useQuery(
    'creds',
    async () => {
      const creds = await getUserCredentials();
      return creds;
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );
