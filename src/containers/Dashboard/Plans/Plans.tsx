import React from 'react'

import PlansHeader from './PlansHeader';
import PlansTable from './PlansTable';

interface PlansProps { }

const Plans: React.FC<PlansProps> = ({ }) => {
    return (
        <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
            <PlansHeader />
            <PlansTable />
        </div>
    );
}
export default Plans