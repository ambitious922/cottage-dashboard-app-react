import { Container } from '@chakra-ui/react';
import { GetConsumerInput, GetConsumerQuery, MonetaryValue, UserStatus } from 'API';
import { useGetConsumer } from 'api/query-hooks/consumer';
import ContainerHeader from 'components/Common/ContainerHeader';
import CottageAlert from 'components/Common/CottageAlert';
import { AlertSeverity } from 'components/Common/CottageAlert/CottageAlert';
import { Spinner } from 'components/Common/Spinner';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import CustomerCard from './CustomerCard';
import CustomerDetailsTable from './CustomerDetailsTable';

export interface CustomerDetailsProps {}
export interface ICustomerDetailsData {
  id: string;
  customerId: string;
  status: UserStatus;
  customerName: string;
  email: string;
  phoneNumber?: string | null;
  customerSince: string;
  creditBalance: MonetaryValue;
  totalSpend: number | 0;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = () => {
  const params: { customerId: string; subdomain: string } = useParams();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const history = useHistory();

  const { customerId, subdomain } = params;

  const getConsumerInput: GetConsumerInput = {
    customerId,
  };

  const getConsumerQuery = useGetConsumer(getConsumerInput);
  const { data, isLoading, isError } = getConsumerQuery;
  const consumer: GetConsumerQuery | null | undefined = data?.data;

  if (isLoading) {
    return <div className="h-screen"><Spinner /></div>;
  }

  if (isError || !consumer) {
    return <div className="h-screen text-center text-grey pt-12">Something went wrong</div>;
  }

  const isBlocked = consumer.getConsumer?.status === UserStatus.BLOCKED;

  const onBackClick = () => history.push(`/business/${subdomain}/customers`);

  return (
    <div className="px-2 md:px-7 py-2 font-sans text-darkGreen">
      <ContainerHeader headerText="Back to Customers" onBackClick={onBackClick} />
      <div className="p-2 md:pt-14 md:pb-0 md:px-10">
        <CustomerCard consumerQueryResponse={consumer} />
        {isBlocked && (
          <Container height="fit-content" minW="fit-content" className="w-full max-w-full p-0 mt-7">
            <CottageAlert severity={AlertSeverity.SOFTWARN}>
              <b>This customer is blocked.</b> This person cannot place any orders or create any new
              accounts using the same email or phone number.
            </CottageAlert>
          </Container>
        )}
      </div>
      <CustomerDetailsTable consumerId={consumer.getConsumer?.id} />
    </div>
  );
};

export default CustomerDetails;
