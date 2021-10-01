import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { PageRoutes } from 'constants/Routes';
import SignInForm from 'components/Auth/SignInForm';
import SignUpForm from 'components/Auth/SignUpForm';
import ForgotPassword from 'components/Auth/ForgotPasswordForm';
import ResetPassword from 'components/Auth/ResetPasswordForm';
import StockImage from 'assets/common/cottage-signup-image.webp';

interface ILoginProps {
  fromForgotPassword?: boolean;
  email: string;
}

const Login: FC<ILoginProps> = ({ fromForgotPassword, email }) => {
  const params = useLocation();

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="mt-6">
            {params.pathname == PageRoutes.SIGN_IN && <SignInForm />}
            {params.pathname == PageRoutes.SIGN_UP && <SignUpForm />}
            {params.pathname == PageRoutes.FORGOT_PASSWORD && <ForgotPassword />}
            {params.pathname == PageRoutes.RESET_PASSWORD && (
              <ResetPassword fromForgotPassword={!!fromForgotPassword} email={email} />
            )}
          </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src={StockImage}
          alt="cottage stock image"
        />
      </div>
    </div>
  );
};

export default Login;
