import React, {useEffect, useRef, useState  } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, FieldProps, } from 'formik';
import { Text, FormControl, FormLabel, Button, Stack } from '@chakra-ui/react';
import {InformationCircleIcon} from '@heroicons/react/outline';
import { TrashIcon, UploadIcon } from '@heroicons/react/solid';

import EditFormPopover from 'components/Common/EditFormPopover/EditFormPopover';
import ImageCropForm, { CropImageType } from 'components/Common/ImageCropForm';

export interface ImageUploadFormProps {
    onSubmit: (coverImage:  { preview: string, raw: any }, logoImage:  { preview: string, raw: any }) => Promise<void>,
    currentLogo: string;
    currentCover: string
}

interface ImageFile {
  preview: string;
  raw: any;
}

export const ImageUploadFormValues = {
    logo: '',
    cover: ''
}

export const ImageUploadFormValidation = Yup.object().shape({});

export type BusinessImage = {
  preview: string,
  raw: File
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onSubmit, currentCover, currentLogo }) => {

    const [logoImage, setLogoImage] = useState<ImageFile>({ preview: '', raw: null });
    const [logoImageFileName, setLogoImageFileName] = useState<any>(null)
    const [coverImage, setCoverImage] = useState<ImageFile>({ preview: '', raw: null });
    const [coverImageFileName, setCoverImageFileName] = useState<any>(null);

    const [logoCroppingModalVisible, setLogoCroppingModalVisible] = useState(false);
    const [coverCroppingModalVisible, setCoverCroppingModalVisible] = useState(false);
    const [upImg, setUpImg] = useState<any>(null);
    const [fileInfo, setFileInfo] = useState<any>(null);

    useEffect(() => {
        setLogoImage({ preview: currentLogo, raw: null })
        setCoverImage({ preview: currentCover, raw: null })
    }, [currentCover, currentLogo])

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        //Open image crop modal
        setLogoCroppingModalVisible(true);
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
        setFileInfo(e.target.files[0]);
      }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        //Open image crop modal
        setCoverCroppingModalVisible(true);
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
        setFileInfo(e.target.files[0]);
      }
    };

    const onClose = () => {
      setLogoCroppingModalVisible(false);
      setCoverCroppingModalVisible(false);
    }

    const uploadCoverImageButton = useRef<HTMLInputElement>(null);
    const uploadLogoImageButton = useRef<HTMLInputElement>(null);

    return ( 
        <Formik 
            initialValues={ImageUploadFormValues} 
            onSubmit={() => onSubmit(coverImage, logoImage)} 
            validationSchema={ImageUploadFormValidation}
        >
            {(formikProps) => {
              return (
                <Form className="space-y-6 pl-4 bg-white" style={{minWidth: '100%'}}>
                  <Field name="logo">
                  {({ field, form }: FieldProps) => (
                      <FormControl>
                        <FormLabel htmlFor="logo" fontSize="14px" fontWeight="500">
                          Business Logo <Text className="inline text-gray-300">(optional) <InformationCircleIcon className="h-5 w-5 inline"/></Text>
                        </FormLabel>
                        <input type="file" name="logo" value={logoImageFileName} onChange={handleLogoChange} ref={uploadLogoImageButton} className="hidden" />
                        <Button
                            className="h-8 text-sm font-semibold bg-softGreen-200 hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
                            style={{ width: '142px' }}
                            onClick={() => uploadLogoImageButton.current?.click()}>
                              + Upload Image
                        </Button>
                        {logoImage.preview ? (
                          <div
                            className="flex items-center justify-between px-3 py-2 mt-4 border-2 rounded-lg gap-x-6 border-lightGreen-100"
                            style={{ width: '188px', height: '126px' }}
                          >
                            <div className="w-full h-full bg-cover" style={{ backgroundImage: `url(${logoImage.preview})` }}></div>
                            <TrashIcon color="#D2E3D5" className="w-8 h-8 cursor-pointer" onClick={() => setLogoImage({ preview: '', raw: null })} />
                          </div>
                        ) : null}
                      </FormControl>
                  )}
                  </Field>
                  <Field name="cover">
                  {({ field, form }: FieldProps) => (
                      <FormControl>
                        <FormLabel htmlFor="cover" fontSize="14px" fontWeight="500">
                          Cover Image <Text className="inline text-gray-300">(optional) <InformationCircleIcon className="h-5 w-5 inline"/></Text>
                        </FormLabel>
                        <input type="file" name="cover" value={coverImageFileName} onChange={handleCoverChange} className="hidden" ref={uploadCoverImageButton} />
                        <Button
                          className="h-8 text-sm font-semibold bg-softGreen-200 hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none"
                          style={{ width: '142px' }}
                          onClick={() => uploadCoverImageButton.current?.click()}>
                          + Upload Image
                        </Button>
                        {coverImage.preview ? (
                          <div
                            className="flex items-center justify-between px-3 py-2 mt-4 border-2 rounded-lg gap-x-6 border-lightGreen-100"
                            style={{ width: '188px', height: '126px' }}
                          >
                            <div className="w-full h-full bg-cover" style={{ backgroundImage: `url(${coverImage.preview})` }}></div>
                            <TrashIcon color="#D2E3D5" className="w-8 h-8 cursor-pointer" onClick={() => setCoverImage({ preview: '', raw: null })} />
                          </div>
                        ) : null}
                      </FormControl>
                  )}
                  </Field>
                  <Stack direction="row">
                    <Button className="focus:outline-none focus:shadow-none" type="submit" width="200px" colorScheme="cottage-green" style={coverImage.preview || logoImage.preview ? {} : {display: 'none'}}>
                        <UploadIcon className="h-5 w-5 mr-2" /> Save
                    </Button>
                    <Button className="bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:outline-none focus:shadow-none" width="200px" style={coverImage.preview || logoImage.preview ? {} : {display: 'none'}} onClick={() => { setCoverImage({ preview: currentCover, raw: null }); setLogoImage({ preview: currentLogo, raw: null }); setCoverImageFileName(''); setLogoImageFileName(''); }}>
                        <TrashIcon className="h-5 w-5 mr-2" /> Cancel
                    </Button>
                  </Stack>
                  <EditFormPopover isOpen={logoCroppingModalVisible} onClose={onClose} title="Image Crop">
                    <ImageCropForm
                      cropFormType={CropImageType.BUSINESS_IMAGE}
                      imageData={upImg}
                      fileInfo={fileInfo}
                      onCompleted={(img: BusinessImage) => {
                        setLogoImage(img)
                      }}
                      onClose={onClose}
                    />
                  </EditFormPopover>
                  <EditFormPopover isOpen={coverCroppingModalVisible} onClose={onClose} title="Image Crop">
                    <ImageCropForm
                      cropFormType={CropImageType.BUSINESS_IMAGE}
                      imageData={upImg}
                      fileInfo={fileInfo}
                      onCompleted={(img: BusinessImage) => {
                        setCoverImage(img)
                      }}
                      onClose={onClose}
                    />
                  </EditFormPopover>
                </Form>
              )
            }}
        </Formik>
     );
}
 
export default ImageUploadForm;