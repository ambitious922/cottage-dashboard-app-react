import {  Storage } from 'aws-amplify';
import { QueryFnProps } from 'models/react-query';

export type GetImagesInput = {
  keys: string[]
}

export type GetImagesResult= {
  data: Map<string, string>
}


export type UploadImageInput = {url: string, file: any}
export const uploadImage = async (input: UploadImageInput) => {
    const {url, file} = input;
    const data = await Storage.put(url, file, {    contentType: 'image/jpeg',
      contentEncoding: 'base64',});
    return data;
  };

export const removeImage = async (url: string) => {
  console.log(url);
  const data = await Storage.remove(url);
  return data;
};

export const getImage = async (url: string) => {
  const data = await Storage.get(url) as string;
  return data;
};


export const getImagesFn = async ({ queryKey }: QueryFnProps<GetImagesInput>) => {
  const [, input] = queryKey;
  const res = new Map<string,string>();
  for (const key of input.keys) {
    const data = await Storage.get(key) as string;
    res.set(key, data);
  }
  return {data: res};
};