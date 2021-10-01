import { Tooltip } from '@chakra-ui/react';
import { InformationCircleIcon } from '@heroicons/react/outline';

export interface CottageTooltipProps {
  text?: string;
}

const CottageTooltip: React.FC<CottageTooltipProps> = ({ text, children }) => {
  return (
    <Tooltip
      label={text}
      bg="white"
      color="#102D29"
      fontSize="sm"
      padding="8px"
      borderRadius="10px"
      boxShadow="0px 0px 5px #d0cfcf"
      placement="top"
      hasArrow
      arrowSize={15}
      className="font-sans font-normal">
      {children || (
        <span className="inline-block">
          <InformationCircleIcon className="w-4" />
        </span>
      )}
    </Tooltip>
  );
};

export default CottageTooltip;
