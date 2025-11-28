import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const FloatingCart = ({ cart, totalPrice, setIsCartOpen }) => {
  return (
    <>
      {cart.length > 0 && (
        <div className="animate-slide-up fixed right-0 bottom-0 left-0 z-30 mx-auto max-w-2xl">
          <div className="m-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#1F5226] to-[#2E6B38] p-3.5 text-white shadow-2xl sm:m-4 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Badge count={cart.length} color="#80D48B" className="shadow-sm">
                <div className="rounded-full bg-white/20 p-2">
                  <ShoppingCartOutlined className="text-lg sm:text-xl" />
                </div>
              </Badge>
              <div>
                <p className="text-xs font-medium opacity-90 sm:text-sm">Your Order</p>
                <p className="text-sm font-bold sm:text-base">
                  {cart.length} item{cart.length > 1 && "s"} • £{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#1F5226] shadow-md transition-all hover:shadow-lg active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;
