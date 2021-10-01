import { Button, FormControl, FormErrorMessage, FormLabel, Input, Box } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ProductCategoryErrors, ProductTagErrors } from 'models/error';
import React, { useState } from 'react';
import { toCamelCase } from 'utils';
import CottageAlert from '../CottageAlert';
import { AlertSeverity } from '../CottageAlert/CottageAlert';
import CottageTag, { CottageTagType } from '../CottageTag/CottageTag';
import { TagFormValidation, CottageTagFormModes, getTagFormValues } from './CottageTagFormFields';

interface TagFormProps {
  onCancel: () => void;
  isSelect: boolean;
  onSelect?: (tags: string[]) => void;
  tags: string[];
  onCreateTag: (tag: string) => Promise<void>;
  onDeleteTag: (tag: string) => Promise<void>;
  setNewHeader: () => void;
  setSelectHeader: () => void;
  setViewHeader: () => void;
  tagColor?: string;
  isFullWidth?: boolean;
  errorMessage?: string;
}

// TODO: Handle showing already exist error when creating a tag

const TagForm: React.FC<TagFormProps> = ({
  onCancel,
  onSelect = () => null,
  isSelect = false,
  tags,
  onCreateTag,
  onDeleteTag,
  setNewHeader,
  setSelectHeader,
  setViewHeader,
  tagColor = '#FFD8BF',
  isFullWidth = false,
}) => {
  const [tagsBeingDeleted, setTagsBeingDeleted] = useState<Set<string>>(new Set());

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set<string>());
  const [modalState, setModalState] = useState<CottageTagFormModes>(
    isSelect ? CottageTagFormModes.SELECT : CottageTagFormModes.VIEW
  );

  const initialModalState = isSelect ? CottageTagFormModes.SELECT : CottageTagFormModes.VIEW;

  const toggleSelectedTag = (tag: string) => {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }

    setSelectedTags(new Set(Array.from(selectedTags)));
  };

  const setView = () => {
    setModalState(CottageTagFormModes.VIEW);
    setViewHeader();
  };

  const setSelect = () => {
    setModalState(CottageTagFormModes.SELECT);
    setSelectHeader();
  };

  const setNew = () => {
    setModalState(CottageTagFormModes.NEW);
    setNewHeader();
  };

  return (
    <Formik
      initialValues={getTagFormValues()}
      validationSchema={TagFormValidation}
      validateOnChange={false}
      onSubmit={async ({ name }, actions) => {
        actions.setStatus({ errorResponseMessage: '' });

        try {
          await onCreateTag(name);
          actions.resetForm();
          if (initialModalState === CottageTagFormModes.VIEW) {
            setView();
          } else {
            setSelect();
          }
        } catch (e) {
          const exception = e?.errors[0];
          const code = exception.extensions?.code;
          let message;
          switch (code) {
            case ProductCategoryErrors.ProductCategoryLimitErrorCode:
              message =
                'Category limit has been reached. Reach out to us if you need to create more.';
              break;
            case ProductCategoryErrors.ProductCategoryDuplicateErrorCode:
              message = `Category with the name ${toCamelCase(name)} already exists`;
              break;
            case ProductTagErrors.ProductTagLimitErrorCode:
              message = 'Tag limit has been reached. Reach out to us if you need to create more.';
              break;
            case ProductTagErrors.ProductTagDuplicateErrorCode:
              message = `Dietary tag with the name ${toCamelCase(name)} already exists`;
              break;
            case ProductCategoryErrors.BusinessNotFoundErrorCode:
            case ProductTagErrors.BusinessNotFoundErrorCode:
            default:
              message = 'Something went wrong';
              break;
          }
          actions.setStatus({ errorResponseMessage: message });
          actions.setSubmitting(false);
        }
      }}>
      {({ isSubmitting, isValid, dirty, status, setStatus, resetForm }) => (
        <Form>
          {modalState === CottageTagFormModes.VIEW && (
            <>
              <Button
                variant="link"
                className="text-sm font-medium text-lightGreen-100 focus:shadow-none"
                onClick={() => {
                  setNew();
                }}>
                + Create new
              </Button>
              <div className="mt-4 mb-4">
                {tags.map((tag) => (
                  <CottageTag
                    tagColor={tagColor}
                    textSize="14px"
                    tagLabelColor="#525D5F"
                    isFullWidth={isFullWidth}
                    // variant={selectedTags.has(tag) ? '' : 'outline'}
                    title={tag}
                    isLoading={tagsBeingDeleted.has(tag)}
                    tagType={CottageTagType.DELETE}
                    onClick={async () => {
                      tagsBeingDeleted.add(tag);
                      setTagsBeingDeleted(new Set(Array.from(tagsBeingDeleted)));
                      try {
                        await onDeleteTag(tag);
                      } catch (e) {
                        const exception = e?.errors[0];
                        const code = exception.extensions?.code;
                        let message;
                        switch (code) {
                          case ProductCategoryErrors.ProductCategoryNotFoundErrorCode:
                          case ProductTagErrors.ProductTagNotFoundErrorCode:
                          case ProductCategoryErrors.BusinessNotFoundErrorCode:
                          case ProductTagErrors.BusinessNotFoundErrorCode:
                          default:
                            message = 'Something went wrong';
                            break;
                        }
                        setStatus({ errorResponseMessage: message });
                      } finally {
                        tagsBeingDeleted.delete(tag);
                        setTagsBeingDeleted(new Set(Array.from(tagsBeingDeleted)));
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {modalState === CottageTagFormModes.SELECT && (
            <>
              <Button
                variant="link"
                className="text-sm font-medium text-lightGreen-100 focus:shadow-none"
                onClick={() => {
                  setNew();
                }}>
                + Create new
              </Button>
              <div className="mt-4 mb-2">
                {tags.map((tag) => (
                  <CottageTag
                    tagColor={tagColor}
                    textSize="14px"
                    tagLabelColor="#525D5F"
                    variant={selectedTags.has(tag) ? '' : 'outline'}
                    title={tag}
                    tagType={CottageTagType.SELECT}
                    onClick={() => {
                      toggleSelectedTag(tag);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {modalState === CottageTagFormModes.NEW && (
            <>
              <Field name="name">
                {({ field, meta }: FieldProps) => (
                  <FormControl isInvalid={!!(meta.touched && meta.error)}>
                    <div className="flex items-baseline">
                      <FormLabel htmlFor="name" className="pr-4">
                        Name
                      </FormLabel>
                      <Box>
                        <Input {...field} id="name" autoComplete="off" />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </Box>
                    </div>
                  </FormControl>
                )}
              </Field>
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="cottage-green"
                height="56px"
                className="mt-4 focus:shadow-none"
                width="full">
                Create
              </Button>
            </>
          )}

          {modalState === CottageTagFormModes.SELECT && (
            <Button
              className="mt-4"
              colorScheme="cottage-green"
              height="56px"
              disabled={selectedTags.size === 0}
              width="full"
              onClick={async () => {
                resetForm();
                onSelect(Array.from(selectedTags));
                onCancel();
              }}>
              <span className="text-white">Save changes</span>
            </Button>
          )}

          <Button
            className="mt-2 bg-softGreen hover:bg-softGreen-100 focus:shadow-none"
            width="full"
            onClick={() => {
              resetForm();
              onCancel();
            }}>
            <span className="text-cottage-green-700">
              {modalState === CottageTagFormModes.VIEW ? 'Close' : 'Cancel'}
            </span>
          </Button>

          {status?.errorResponseMessage && (
            <Box mt={4}>
              <CottageAlert severity={AlertSeverity.ERROR}>
                {status.errorResponseMessage}
              </CottageAlert>
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default TagForm;
