export interface ICouponTableHeaderProps {
  totalCoupons: number;
}

const CouponTableHeader: React.FC<ICouponTableHeaderProps> = ({ totalCoupons }) => {
  return (
    <div className="flex gap-4 items-center py-5">
      <div className="text-base font-medium">
        Total of {totalCoupons} published {totalCoupons === 1 ? 'coupon' : 'coupons'}
      </div>
    </div>
  );
};

export default CouponTableHeader;
