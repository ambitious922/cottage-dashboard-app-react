import { FC, useState } from 'react';
import ReactCodeInput from 'react-code-input';
import { confirmSignUp, getUserCredentials } from 'api/auth';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';
import { AmplifyErrors } from 'models/error';

export interface ConfirmSignUpFormProps {
  email: string;
  onClose: () => void;
  onValidSignUp: (id: string) => void;
}

const baseCodeStyle = {
  fontFamily: 'Daikon',
  // MozAppearance: 'textfield',
  borderRadius: '0.375rem',
  border: '2px solid',
  borderColor: '#D2E3D5',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  paddingLeft: 'auto',
  paddingRight: 0,
  // textAlign: 'center',
  margin: '0.5rem',
  width: '2.5rem',
  height: '3rem',
  fontSize: '1.5rem',
  color: '#235C48',
  // boxSizing: "border-box",
};

const FormFieldContent = {
  CODE: {
    title: 'Enter Verification Code',
    label:
      'We sent you an email containing a verification code. Enter your code here to finish setting up your account.',
    field: 'code',
  },
};

const validateCode = (code: string) => {
  if (code.length === 6) {
    return true;
  }
  return false;
};

const ConfirmSignUpForm: FC<ConfirmSignUpFormProps> = ({ email, onValidSignUp, onClose }) => {
  const [open, setOpen] = useState(true);
  const [codeError, setCodeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [code, setCode] = useState('');

  const clearErrors = () => {
    setCodeError(false);
    setIsLoading(false);
    setApiErrorMessage('');
  };

  const onConfirm = async () => {
    try {
      const creds = await getUserCredentials();

      const authenticatedUser = await confirmSignUp(email as string, code);
      const { id } = authenticatedUser;
      onValidSignUp(id);
      onClose();
    } catch (e) {
      let message;
      switch (e) {
        case AmplifyErrors.CodeMismatchException:
          message = 'Code did not match our records.';
          break;
        case AmplifyErrors.ExpiredCodeException:
          message = 'This code has expired. Please resend a code to youre email.';
          break;
        case AmplifyErrors.TooManyFailedAttemptsException:
          message = 'Too many failed attempts, try again in a little while.';
          break;
        case AmplifyErrors.TooManyRequestsException:
          message = 'Too many requests were made, try again in a little while.';
          break;
        default:
          message = 'Something went wrong, please try again in a little while.';
      }
      setApiErrorMessage(message);
      setIsLoading(false);
      console.log(JSON.stringify(e));
      // TODO: error handling
    }
  };

  const handleConfirmSignUp = async () => {
    clearErrors();
    setIsLoading(true);
    const valid = validateCode(code);
    if (!valid) {
      setCodeError(true);
      setIsLoading(false);
      return;
    }
    onConfirm();
  };

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="border-b">{FormFieldContent.CODE.title}</ModalHeader>
        <ModalCloseButton className="mt-2" />
        <ModalBody px={8} pt={0} pb={8}>
          <Text className="text-sm text-darkGreen mt-4">{FormFieldContent.CODE.label}</Text>
          <div className="flex justify-center items-center mt-5">
            <ReactCodeInput
              type="text"
              fields={6}
              value={code}
              onChange={(value) => setCode(value)}
              name={FormFieldContent.CODE.field}
              inputStyle={{ ...baseCodeStyle }}
              inputMode="email"
            />
          </div>

          {codeError && (
            <div className="mt-0">
              <Text color="#EB6237" className="text-xs font-medium text-center">
                You must enter all 6 digits to confirm your email
              </Text>
            </div>
          )}

          {apiErrorMessage && (
            <div className="mt-0">
              <Text color="#EB6237" className="text-xs font-medium text-center">
                {apiErrorMessage}
              </Text>
            </div>
          )}

          <div className="text-xs text-darkGreen mt-5">
            <strong>Can't find the email?</strong> Check your promotions/spam folder.
          </div>
          <div className="mt-5 sm:mt-6">
            <Button
              type="button"
              height="56px"
              colorScheme="cottage-green"
              className="text-sm font-semibold w-full focus:outline-none focus:shadow-none"
              isLoading={isLoading}
              onClick={handleConfirmSignUp}>
              Verify your account
            </Button>
            <Button
              height="36px"
              className="mt-2 text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none w-full"
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmSignUpForm;
