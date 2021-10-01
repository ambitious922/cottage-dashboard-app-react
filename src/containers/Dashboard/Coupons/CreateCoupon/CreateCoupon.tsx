import CouponForm from '../CouponForm';

export interface CreateCouponContainerProps {}

const CreateCoupon: React.FC<CreateCouponContainerProps> = () => {
  return (
    <div
      className="font-sans"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        color: '#102D29',
      }}>
      <CouponForm />
    </div>
  );
};

export default CreateCoupon;
