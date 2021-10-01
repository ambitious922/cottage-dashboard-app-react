import { CreateProductTagInput, DeleteProductTagInput } from 'API';
import {
  useCreateProductTag,
  useDeleteProductTag,
  useGetProductTags,
} from 'api/query-hooks/product';
import { AppContext } from 'App';
import React, { useContext } from 'react';
import CottageTagForm from 'components/Common/CottageTagForm';
import { Spinner } from 'components/Common/Spinner';

interface TagFormProps {
  onCancel: () => void;
  isSelect: boolean;
  onSelect: (tags: string[]) => void;
  setNewHeader: () => void;
  setSelectHeader: () => void;
  setViewHeader: () => void;
  tagsToHide?: string[];
}

const TagForm: React.FC<TagFormProps> = ({
  isSelect = false,
  onCancel,
  setNewHeader,
  setSelectHeader,
  setViewHeader,
  onSelect,
  tagsToHide = [],
}) => {
  const hiddenTags = new Set(tagsToHide);

  const businessId = useContext(AppContext).businessId;
  const getTags = useGetProductTags(
    { businessId },
    {
      cacheTime: 0,
    }
  );

  const createTag = useCreateProductTag();
  const deleteTag = useDeleteProductTag();

  const onCreateTag = async (productTag: string) => {
    const input: CreateProductTagInput = { businessId, productTag };
    await createTag.mutateAsync(input);
    await getTags.refetch();
  };

  const onDeleteTag = async (productTag: string) => {
    const input: DeleteProductTagInput = {
      businessId,
      productTag,
    };
    await deleteTag.mutateAsync(input);
    await getTags.refetch();
  };

  if (getTags.isLoading) return <Spinner />;

  const productTags = getTags.data?.data?.getBusiness?.productTags || [];
  const filteredTags = productTags.filter((tag) => !hiddenTags.has(tag));
  return (
    <>
      <CottageTagForm
        onCreateTag={onCreateTag}
        onDeleteTag={onDeleteTag}
        onSelect={onSelect}
        isSelect={isSelect}
        tags={filteredTags}
        onCancel={onCancel}
        setNewHeader={setNewHeader}
        setViewHeader={setViewHeader}
        setSelectHeader={setSelectHeader}
        tagColor={'#FFD8BF'}
      />
    </>
  );
};
export default TagForm;
