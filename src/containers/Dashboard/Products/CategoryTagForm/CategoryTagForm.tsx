import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

import { CreateProductCategoryInput, DeleteProductCategoryInput } from 'API';
import {
  useCreateProductCategory,
  useDeleteProductCategory,
  useGetProductCategories,
} from 'api/query-hooks/product';
import { AppContext } from 'App';
import CottageTagForm from 'components/Common/CottageTagForm';
import { Spinner } from 'components/Common/Spinner';

interface TagFormProps {
  setModalHeaderText: Dispatch<SetStateAction<string>>;
  onCancel: () => void;
  isSelect: boolean;
  onSelect?: (tags: string[]) => void;
  setNewHeader: () => void;
  setSelectHeader: () => void;
  setViewHeader: () => void;
  categoriesToHide?: string[];
}

const TagForm: React.FC<TagFormProps> = ({
  isSelect = false,
  onCancel,
  setNewHeader,
  setViewHeader,
  setSelectHeader,
  categoriesToHide,
  onSelect,
}) => {
  const hiddenCategories = new Set(categoriesToHide);

  const { businessId } = useContext(AppContext);

  const getCategoriesQuery = useGetProductCategories(
    { businessId },
    {
      cacheTime: 0,
    }
  );

  const createCategoryMutation = useCreateProductCategory();
  const deleteCategoryMutation = useDeleteProductCategory();

  const onCreateTag = async (productCategory: string) => {
    const input: CreateProductCategoryInput = { businessId, productCategory };
    await createCategoryMutation.mutateAsync(input);
    await getCategoriesQuery.refetch();
  };

  const onDeleteTag = async (productCategory: string) => {
    const input: DeleteProductCategoryInput = {
      businessId,
      productCategory,
    };
    await deleteCategoryMutation.mutateAsync(input);
    await getCategoriesQuery.refetch();
  };

  // TODO style this spinner
  if (getCategoriesQuery.isLoading) return <Spinner />;

  const categories = getCategoriesQuery.data?.data?.getBusiness?.productCategories || [];
  const filteredCategories = categories.filter((category) => !hiddenCategories.has(category));

  return (
    <>
      <CottageTagForm
        onCreateTag={onCreateTag}
        onDeleteTag={onDeleteTag}
        isSelect={isSelect}
        onSelect={onSelect}
        tags={filteredCategories}
        onCancel={onCancel}
        setNewHeader={setNewHeader}
        setViewHeader={setViewHeader}
        setSelectHeader={setSelectHeader}
        tagColor={'#E4EEF6'}
        isFullWidth={true}
      />
    </>
  );
};
export default TagForm;
