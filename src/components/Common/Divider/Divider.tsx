import React from 'react';

export interface DividerProps {
    color?: string;
}
 
const Divider: React.FC<DividerProps> = ({ color = 'gray' }) => {
    return ( 
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className={`w-full border-t border-${color}-300`} />
          </div>
        </div>
     );
}
 
export default Divider;