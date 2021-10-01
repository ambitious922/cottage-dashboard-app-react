import PurchasesHeader from './PurchaseHeader';
import PurchasesTable from './PurchaseTable/PurchaseTable';

interface PurchaseProps { }

const Purchases: React.FC<PurchaseProps> = ({ }) => {
  return (
    <div className="px-4 md:px-16 py-4 md:py-9 font-sans text-darkGreen">
      <PurchasesHeader />
      <PurchasesTable />
    </div>
  );
};
export default Purchases;
