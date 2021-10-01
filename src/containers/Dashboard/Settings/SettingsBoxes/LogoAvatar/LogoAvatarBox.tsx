import React, { useContext, useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import ImageUploadForm from './ImageUploadForm';
import { AppContext } from 'App';
import { useUpdateBusiness } from 'api/query-hooks/business';
import { Spinner, SpinnerSize } from 'components/Common/Spinner/Spinner';
import { getImage, removeImage, uploadImage, UploadImageInput } from 'api/images';

export interface LogoAvatarBoxProps {
  currentLogoKey: string;
  currentCoverKey: string;
}

// TODO revist this component, to get the rest of the settings changes out
const LogoAvatarBox: React.FC<LogoAvatarBoxProps> = ({ currentCoverKey, currentLogoKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [failureModal, setFailureModal] = useState(false);
  const [currentS3LogoImage, setCurrentS3LogoImage] = useState('');
  const [currentS3CoverImage, setCurrentS3CoverImage] = useState('');

  const appContext = useContext(AppContext);
  const { businessId, producerId } = appContext;

  useEffect(() => {
    if (currentCoverKey) {
      (async () => {
        const coverUrl = await getImage(currentCoverKey);
        setCurrentS3CoverImage(coverUrl);
      })();
    }
    if (currentLogoKey) {
      (async () => {
        const logoUrl = await getImage(currentLogoKey);
        setCurrentS3LogoImage(logoUrl);
      })();
    }
  }, [currentCoverKey, currentLogoKey]);

  const updateBusinessMutation = useUpdateBusiness();

  const generateAvatarImageKey = () => {
    return `business/${businessId}/avatar/${uuidv4()}.jpeg`;
  };

  const generateCoverImageKey = () => {
    return `business/${businessId}/cover/${uuidv4()}.jpeg`;
  };

  if (isLoading) {
    return <Spinner size={SpinnerSize.XLARGE} />;
  }

  const onSubmit = async (
    coverImage: { preview: string; raw: any },
    logoImage: { preview: string; raw: any }
  ) => {
    console.log({ coverImage, logoImage });
    setIsLoading(true);
    try {
      if (!!logoImage.raw?.size && !!coverImage.raw?.size) {
        const coverImageKey = generateCoverImageKey();
        const logoImageKey = generateAvatarImageKey();
        const imageLogoInput: UploadImageInput = {
          file: logoImage.raw,
          url: logoImageKey,
        };
        const imageCoverInput: UploadImageInput = {
          file: coverImage.raw,
          url: coverImageKey,
        };
        try {
          await uploadImage(imageCoverInput);
          await uploadImage(imageLogoInput);
          await removeImage(currentCoverKey);
          await removeImage(currentLogoKey);
          try {
            const res = await updateBusinessMutation.mutateAsync({
              businessId,
              producerId,
              coverImage: coverImageKey,
              avatarImage: logoImageKey,
            });
            setSuccessModal(true);
          } catch (e: any) {
            console.log(e);
            setFailureModal(true);
          }
        } catch (e: any) {
          console.log(e);
          setFailureModal(true);
        } finally {
          // TODO: display error message if any
        }
      } else if (!!logoImage.raw?.size) {
        const imageKey = generateAvatarImageKey();
        const imageInput: UploadImageInput = {
          file: logoImage.raw,
          url: imageKey,
        };
        try {
          await uploadImage(imageInput);
          await removeImage(currentLogoKey);
          try {
            const res = await updateBusinessMutation.mutateAsync({
              businessId,
              producerId,
              avatarImage: imageKey,
            });
            setSuccessModal(true);
          } catch (e: any) {
            console.log(e);
            setFailureModal(true);
          }
        } catch (e: any) {
          console.log(e);
          setFailureModal(true);
        } finally {
          // TODO: display error message if any
        }
      } else if (!!coverImage.raw?.size) {
        const imageKey = generateCoverImageKey();
        const imageInput: UploadImageInput = {
          file: coverImage.raw,
          url: imageKey,
        };
        try {
          await uploadImage(imageInput);
          await removeImage(currentCoverKey);
          try {
            const res = await updateBusinessMutation.mutateAsync({
              businessId,
              producerId,
              coverImage: imageKey,
            });
            setSuccessModal(true);
          } catch (e: any) {
            console.log(e);
            setFailureModal(true);
          }
        } catch (e: any) {
          console.log(e);
          setFailureModal(true);
          // we dont want to update in api if s3 call fails
        } finally {
          // TODO: display error message if any
        }
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessDialog = () => (
    <Modal isOpen={successModal} onClose={() => setSuccessModal(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-green-800">Success!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>You've successfully updated your business's image.</ModalBody>
        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={() => setSuccessModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const FailureDialog = () => (
    <Modal isOpen={failureModal} onClose={() => setFailureModal(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-red-800">An Error Occurred</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          We could not update your business's image at this time Please try again later.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={() => setFailureModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  return (
    <Stack direction="row" className="bg-white my-4 p-6 rounded-lg">
      {successModal && <SuccessDialog />}
      {failureModal && <FailureDialog />}
      <Box style={{ maxWidth: '25%' }}>
        <Text fontSize="17px" fontWeight="500">
          Logo and Imagery
        </Text>
        <Text className="my-2 mb-6 text-sm text-grey">
          Customize the look of your online menu by adding your logo or a splash photo at the top of
          your shop page.
        </Text>
      </Box>
      <Box className="w-full">
        <ImageUploadForm
          onSubmit={onSubmit}
          currentLogo={currentS3LogoImage}
          currentCover={currentS3CoverImage}
        />
      </Box>
    </Stack>
  );
};

export default LogoAvatarBox;
