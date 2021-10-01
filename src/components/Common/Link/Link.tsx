import React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';

interface LinkProps {
  external?: boolean;
}

const Link: React.FC<LinkProps & ReactRouterLinkProps> = ({
  external = false,
  children,
  ...props
}) => {
  if (external) {
    return (
      <a className="font-medium text-cottage-green-500 hover:text-cottage-green-300" {...props}>
        {children}
      </a>
    );
  }
  return (
    <ReactRouterLink
      className="font-medium text-cottage-green-500 hover:text-cottage-green-300"
      {...props}>
      {children}
    </ReactRouterLink>
  );
};

export default Link;
