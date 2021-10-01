import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FrontendImage } from 'containers/Dashboard/Plans/CreatePlan/PlanFormFields';
import { BusinessImage } from 'containers/Dashboard/Settings/SettingsBoxes/LogoAvatar/ImageUploadForm';
import { Box, Button } from '@chakra-ui/react';

export enum CropImageType {
  FRONTEND_IMAGE= 'FRONTEND_IMAGE',
  BUSINESS_IMAGE= 'BUSINESS_IMAGE',
}

interface CropFormProps {
  cropFormType: CropImageType
  imageData: string;
  onCompleted: Function;
  fileInfo: File;
  onClose: Function;
}

interface cropType {
  unit: string;
  width: number;
  height: number;
  x: number;
  y: number;
  aspect: number;
}

const CropForm: React.FC<CropFormProps> = ({
  cropFormType,
  imageData,
  onCompleted,
  fileInfo,
  onClose
}) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState<any>({ unit: '%', width: 50, aspect: 4 / 4 });
 
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const getCroppedImg = (image:any, crop: cropType, fileName: string) => {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx:any = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob: any) => {
          if (!blob) {
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          let fileUrl: any = {};
          window.URL.revokeObjectURL(fileUrl);
          fileUrl = window.URL.createObjectURL(blob);
          resolve(fileUrl);
        },
        'image/jpeg',
        1
      );
    });
  }

  const cropCompleted = async (): Promise<any> => {
    const croppedImageUrl: any = await getCroppedImg(
      imgRef.current,
      crop,
      fileInfo.name
    );
    
    if (cropFormType === CropImageType.FRONTEND_IMAGE){
      const image: FrontendImage = {
        url: croppedImageUrl,
        file: fileInfo,
      };
      onCompleted(image);
    } else {
      const image: BusinessImage = {
        preview: croppedImageUrl,
        raw: fileInfo,
      };
      onCompleted(image);
    }

    onClose();
  }

  return (
    <Box>
      <ReactCrop
        className="w-full m-auto"
        src={imageData}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c: any) => setCrop(c)}
      />

      <Button 
        colorScheme="cottage-green" 
        className="mt-5 w-full focus:shadow-none"
        onClick={cropCompleted}
      >
        Crop
      </Button>
    </Box>
  );
};
export default CropForm;
