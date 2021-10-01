export interface ICouponTableHeaderProps {
  totalCoupons: number;
  activeTab: string;
}

const CouponTableHeader: React.FC<ICouponTableHeaderProps> = ({ totalCoupons, activeTab }) => {
  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {totalCoupons} {activeTab.toLowerCase()}{' '}
        {totalCoupons === 1 ? 'coupon' : 'coupons'}
      </div>
    </div>
  );
};

export default CouponTableHeader;
