import { Tag, Spinner as ChakraSpinner, TagLabel } from '@chakra-ui/react';
import { PencilIcon, PlusIcon, XIcon } from '@heroicons/react/solid';
import { toCamelCase } from 'utils';

export enum CottageTagType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  SELECT = 'SELECT',
}

interface ICottageTagProps {
  title: string;
  onClick?: () => void;
  tagType: CottageTagType;
  tagColor: string;
  tagLabelColor?: string;
  textSize?: string;
  textUpperCase?: boolean;
  marginTop?: string;
  isLoading?: boolean;
  variant?: string;
  isFullWidth?: boolean;
}

const CottageTag: React.FC<ICottageTagProps> = ({
  title,
  onClick,
  tagType,
  tagColor,
  tagLabelColor = '#102D29',
  textSize = '12px',
  textUpperCase = false,
  marginTop = '0px',
  isLoading = false,
  variant = 'subtle',
  isFullWidth = false,
}) => {
  const renderIcon = () => {
    if (isLoading) {
      return (
        <ChakraSpinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="gray.500"
          size={'xs'}
        />
      );
    }
    switch (tagType) {
      case CottageTagType.ADD:
        return (
          <span className="inline-block ml-1">
            <PlusIcon className="w-3" />
          </span>
        );
      case CottageTagType.EDIT:
        return (
          <span className="inline-block ml-1">
            <PencilIcon className="w-3" />
          </span>
        );
      case CottageTagType.DELETE:
        return (
          <span className="inline-block ml-1">
            <XIcon className="w-3" />
          </span>
        );
      default:
        return <></>;
    }
  };

  return (
    <Tag
      key={title}
      bgColor={variant == 'outline' ? 'transparent' : tagColor}
      boxShadow={variant == 'outline' ? `inset 0 0 0px 2px ${tagColor}` : ''}
      variant={variant}
      className={isFullWidth ? 'w-full flex justify-between items-center mb-2' : ''}
      py={1}
      px={2}
      mr={2}
      mt={marginTop}
      cursor={tagType === CottageTagType.VIEW ? 'cursor' : 'pointer'}
      onClick={() => (onClick ? onClick() : () => null)}>
      <TagLabel color={tagLabelColor} fontSize={textSize} fontWeight="600">
        {textUpperCase ? title.toUpperCase() : toCamelCase(title, '_')}
      </TagLabel>
      {renderIcon()}
    </Tag>
  );
};

export default CottageTag;
