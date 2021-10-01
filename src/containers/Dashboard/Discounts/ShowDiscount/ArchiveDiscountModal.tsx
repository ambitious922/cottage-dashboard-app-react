import React, { SetStateAction } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Divider,
    Stack,
} from "@chakra-ui/react"

export interface ArchiveDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    discountTitle: string;
    discountId: string;
}
 
const ArchiveDiscountModal: React.FC<ArchiveDiscountModalProps> = ({ isOpen, onClose, discountTitle, discountId }) => {
    return ( 
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Archive Discount: {discountTitle}</ModalHeader>
                <ModalCloseButton />
                <Divider />
                <ModalBody>
                    All locations participating in in this coupon will automatically 
                    be removed once this discount is archived and it will 
                    no longer be usable for future purchases.
                </ModalBody>
                <ModalFooter>
                 <Stack direction="column" width="100%">
                    <Button variant="outline" colorScheme="green" isFullWidth>Archive Discount</Button>
                    <Button isFullWidth colorScheme="green" mr={3} onClick={onClose}>Close</Button>
                 </Stack>
                </ModalFooter>
                </ModalContent>
          </Modal>
    );
}
 
export default ArchiveDiscountModal;

 
