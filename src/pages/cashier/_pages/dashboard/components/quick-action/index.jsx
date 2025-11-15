import React from "react";
import { Button } from "antd";
import { ICONS } from "../../../../../../constants";
import { useNavigate } from "react-router-dom";

const QuickAccess = () => {
  const naviagte = useNavigate();

  const btnClasses =
    "!border-primary text-primary flex w-full items-center gap-2 rounded-md border !bg-transparent text-xl hover:!bg-[#B4FFC0] hover:!border-primary hover:!text-primary transition-all duration-200";

  return (
    <div className="flex w-full items-center gap-6 bg-inherit p-5">
      {/* Title */}
      <h3 className="text-lg font-medium whitespace-nowrap text-[#00BC1A]">Quick access</h3>

      {/* Buttons Row */}
      <div className="flex w-full gap-4">
        <Button
          icon={<img src={ICONS.dishBorder} alt="dish" className="h-6 w-6" />}
          className={btnClasses}
          onClick={() => naviagte("/cashier/orders")}
        >
          All Orders
        </Button>
        <Button
          icon={<img src={ICONS.addIcon} alt="add" className="h-6 w-6" />}
          className={btnClasses}
          onClick={() => naviagte("/cashier/create-orders")}
        >
          Add New Order
        </Button>

        <Button
          icon={<img src={ICONS.transactionsIcon} alt="transactionsIcon" className="h-6 w-6" />}
          className={btnClasses}
          onClick={() => naviagte("/cashier/transaction")}
        >
          All Transactions
        </Button>
      </div>
    </div>
  );
};

export default QuickAccess;
