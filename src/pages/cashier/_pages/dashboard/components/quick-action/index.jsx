// import React from "react";
// import { Button } from "antd";
// import { ICONS } from "../../../../../../constants";

// const QuickAccess = () => {
//   return (
//     <div className="flex">
//       <h3 className="text-2xl font-semibold text-[#00BC1A]">Quick access</h3>
//       <Button className="!bg-inherit" />
//     </div>
//   );
// };

// export default QuickAccess;

import React from "react";
import { Button } from "antd";
import { BellOutlined, PlusOutlined, DollarOutlined } from "@ant-design/icons";
import { ICONS } from "../../../../../../constants";
const QuickAccess = () => {
  return (
    <div className="flex w-full items-center gap-6 bg-inherit p-5">
      {/* Title */}
      <h3 className="text-lg font-medium whitespace-nowrap text-[#00BC1A]">Quick access</h3>

      {/* Buttons Row */}
      <div className="flex w-full gap-4">
        <Button
          icon={<img src={ICONS.dishBorder} alt="dish" className="h-6 w-6" />}
          className="!border-primary text-primary flex w-full items-center gap-2 rounded-md border !bg-transparent text-xl"
        >
          New orders Queue
        </Button>

        <Button
          icon={<img src={ICONS.addIcon} alt="add" className="h-6 w-6" />}
          className="text-primary !border-primary flex w-full items-center gap-2 rounded-md border !bg-transparent text-xl"
        >
          Add New Order
        </Button>

        <Button
          icon={<img src={ICONS.transactionsIcon} alt="transactionsIcon" className="h-6 w-6" />}
          className="text-primary !border-primary flex w-full items-center gap-2 rounded-md border !bg-transparent text-xl"
        >
          All Transactions
        </Button>
      </div>
    </div>
  );
};

export default QuickAccess;
