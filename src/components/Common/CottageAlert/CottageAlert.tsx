import React from 'react';
import {
  InformationCircleIcon,
  ExclamationIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/solid';

import { ExclamationIcon as ExclamationIconOutline } from '@heroicons/react/outline';

export enum AlertSeverity {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SOFTINFO = 'SOFTINFO',
  SOFTWARN = 'SOFTWARN',
}

interface AlertProps {
  severity: AlertSeverity;
}

const CottageAlert: React.FC<AlertProps> = ({ children, severity }) => {
  const renderIcon = () => {
    switch (severity) {
      case AlertSeverity.INFO:
        return <InformationCircleIcon className="w-5 h-5 text-purple-400" aria-hidden="true" />;
      case AlertSeverity.SUCCESS:
        return <CheckCircleIcon className="w-5 h-5 text-green-400" aria-hidden="true" />;
      case AlertSeverity.ERROR:
        return <ExclamationCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />;
      case AlertSeverity.WARN:
        return <ExclamationIcon className="w-5 h-5 text-yellow-400" aria-hidden="true" />;
      case AlertSeverity.SOFTINFO:
        return <ExclamationIconOutline className="w-5 h-5 text-white" aria-hidden="true" />;
      case AlertSeverity.SOFTWARN:
        return <ExclamationIconOutline className="w-5 h-5 text-white" aria-hidden="true" />;
    }
  };

  const fontColor = () => {
    switch (severity) {
      case AlertSeverity.INFO:
        return 'text-purple-700';
      case AlertSeverity.SUCCESS:
        return 'text-green-700';
      case AlertSeverity.ERROR:
        return 'text-error';
      case AlertSeverity.WARN:
        return 'text-yellow-700';
      case AlertSeverity.SOFTINFO:
        return 'text-white';
      case AlertSeverity.SOFTWARN:
        return 'text-white';
    }
  };

  const bgColor = () => {
    switch (severity) {
      case AlertSeverity.INFO:
        return 'bg-purple-50';
      case AlertSeverity.SUCCESS:
        return 'bg-green-50';
      case AlertSeverity.ERROR:
        return 'bg-red-100';
      case AlertSeverity.WARN:
        return 'bg-yellow-50';
      case AlertSeverity.SOFTINFO:
        return 'bg-indigo-500';
      case AlertSeverity.SOFTWARN:
        return 'bg-softWarn';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${bgColor()}`}>
      <div className="flex">
        <div className="flex-shrink-0">{renderIcon()} </div>
        <div className="flex-1 ml-3 md:flex md:justify-between">
          <p className={`text-sm ${fontColor()}`}>{children}</p>
        </div>
      </div>
    </div>
  );
};

export default CottageAlert;
