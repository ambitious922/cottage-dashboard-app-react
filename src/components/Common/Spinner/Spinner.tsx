import { Spinner as CustomSpinner, Heading, Stack } from "@chakra-ui/react"
import React from 'react';

export interface SpinnerProps {
    size?: SpinnerSize,
}

export enum SpinnerSize {
    XSMALL = 'xs',
    SMALL = 'sm',
    MEDIUM = 'md',
    LARGE = 'lg',
    XLARGE = 'xl'
}
 
export const Spinner: React.FC<SpinnerProps> = ({ size = SpinnerSize.MEDIUM }) => {
    return ( 
        <div className="flex justify-center min-w-screen h-full bg-white">
            <div className="flex justify-center  flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <Stack direction="column" style={{justifyContent: 'center', alignItems: 'center'}}>
                    <CustomSpinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="green.500"
                    size={size}
                    />
                </Stack>
            </div>
        </div>
     );
}
 