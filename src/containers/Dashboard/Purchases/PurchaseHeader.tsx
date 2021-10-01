import { Button } from '@chakra-ui/react';

export default function PurchasesHeader() {
  const exportPurchases = () => null;

  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
          Purchases
        </h2>
      </div>
    </div>
  );
}
