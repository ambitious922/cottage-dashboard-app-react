import { useContext, useState } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { InvoiceStatus, GetSubscriptionInvoiceInput } from 'API';
import { AppContext } from 'App';
import { displayableDate, displayableMonetaryValue } from 'utils';
import CottageTag from 'components/Common/CottageTag';
import { CottageTagType } from 'components/Common/CottageTag/CottageTag';
import { Spinner } from 'components/Common/Spinner';
import { useGetSubscriptionInvoice } from 'api/query-hooks/subscriptioninvoice';

export interface ISubscriptionInvoiceDetailsProps {
  subscriptionInvoiceId: string | undefined;
  onClose?: () => void;
}

const OrderDetailsModal: React.FC<ISubscriptionInvoiceDetailsProps> = ({
  subscriptionInvoiceId,
  onClose,
}) => {
  const { businessId } = useContext(AppContext);

  if (!subscriptionInvoiceId) {
    return <div></div>;
  }

  const getSubscriptionInvoiceInput: GetSubscriptionInvoiceInput = {
    businessId,
    subscriptionInvoiceId,
  };

  const { data, isLoading, isError } = useGetSubscriptionInvoice(getSubscriptionInvoiceInput);
  const subscriptionInvoice = data?.data?.subscriptionInvoice;

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  if (isError || !subscriptionInvoice) {
    return (
      <Box>
        <div className="text-center text-sm text-darkGray">Something went wrong</div>
      </Box>
    );
  }

  const subtotalAmount = subscriptionInvoice.cost?.subtotal?.amount || 0;
  const estTaxAmount = subscriptionInvoice.cost?.estimatedTax?.amount || 0;
  const serviceFeeAmount = subscriptionInvoice.cost?.serviceFee?.amount || 0;
  const totalAmount = subscriptionInvoice.cost?.total?.amount || 0;

  const getInvoiceStatusColor = (orderStatus: any) => {
    switch (orderStatus) {
      case InvoiceStatus.PAID:
        return 'rgba(78, 162, 65, 0.2)';
      case InvoiceStatus.VOID:
      case InvoiceStatus.UNCOLLECTIBLE:
        return 'rgba(235, 98, 55, 0.2)';
      default:
        return 'rgba(235, 98, 55, 0.2)';
    }
  };

  return (
    <div className="px-4">
      <div className="py-5">
        <table className="w-full">
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen w-24 py-2">Date</td>
            <td className="text-sm font-medium text-left text-darkGray py-2">
              {displayableDate(subscriptionInvoice.createdAt)}
            </td>
            <td className="text-sm font-semibold text-right text-darkGreen w-16 px-2 py-2">Status</td>
            <td className="text-sm font-medium text-right text-darkGray pl-4 py-2 w-1 whitespace-nowrap">
              {
                <CottageTag
                  title={subscriptionInvoice.invoiceStatus}
                  tagType={CottageTagType.VIEW}
                  tagColor={getInvoiceStatusColor(subscriptionInvoice.invoiceStatus)}
                />
              }
            </td>
          </tr>
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen w-24 py-2">Type</td>
            <td className="text-sm font-medium text-left text-darkGray py-2">Subscription</td>
          </tr>
          <tr>
            <td className="text-sm font-semibold text-left text-darkGreen pt-2 pb-4">Payment</td>
            <td className="text-sm font-medium text-left text-darkGray pt-2 pb-4">
              {`${subscriptionInvoice.cardBrand?.toUpperCase() || ''} ending in ${
                subscriptionInvoice.cardLastFour || ''
              }`}
            </td>
          </tr>
          <tr>
            <td colSpan={5} className="border-t"></td>
          </tr>
        </table>
      </div>
      <div className="bg-softGreen-20 rounded-lg p-5 mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm font-medium text-left text-darkGreen">Subscription</th>
              <th className="text-sm font-medium text-right text-darkGreen">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm text-left text-darkGray">{subscriptionInvoice.planTitle}</td>
              <td className="text-sm text-right text-darkGray">
                {displayableMonetaryValue(subscriptionInvoice.cost?.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border-b pt-5"></td>
            </tr>
            <tr>
              <td className="text-sm font-medium text-left text-darkGreen pt-5 pb-3.5">Subtotal</td>
              <td className="text-sm font-medium text-right text-darkGray pt-5 pb-3.5">
                {displayableMonetaryValue(subscriptionInvoice.cost?.subtotal)}
              </td>
            </tr>
            <tr>
              <td className="text-sm font-medium text-left text-darkGray">Tax</td>
              <td className="text-sm font-medium text-right text-darkGray">
                {displayableMonetaryValue(subscriptionInvoice.cost?.estimatedTax)}
              </td>
            </tr>
            <tr>
              <td className="text-sm font-medium text-left text-darkGray">Service Fee</td>
              <td className="text-sm font-medium text-right text-darkGray">
                {displayableMonetaryValue(subscriptionInvoice.cost?.serviceFee)}
              </td>
            </tr>
            <tr>
              <td className="text-sm font-medium text-left text-darkGreen pt-6">Total Charged</td>
              <td className="text-sm font-medium text-right text-darkGray pt-6">
                {displayableMonetaryValue(subscriptionInvoice.cost?.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-start gap-6">
        {/** TODO support receipt printing */}
        <Button
          variant="link"
          fontSize="14px"
          fontWeight="400"
          colorScheme="cottage-green"
          className="text-lightGreen-100 underline shadow-none hover:shadow-none"
          // TODO implement this
          onClick={() => {}}>
          Print Receipt
        </Button>
        <Button
          variant="link"
          fontSize="14px"
          fontWeight="400"
          colorScheme="cottage-green"
          className="text-lightGreen-100 underline shadow-none hover:shadow-none"
          // TODO implement this
          onClick={() => {}}>
          Apply a Refund
        </Button>
      </div>
      <Button
        height="36px"
        className="w-full mt-7 font-sans text-sm font-semibold bg-softGreen hover:bg-softGreen-100 text-lightGreen-100 focus:shadow-none"
        onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export default OrderDetailsModal;
