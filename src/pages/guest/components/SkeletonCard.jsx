import { Skeleton } from "antd";
import React from "react";

const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <Skeleton.Image active className="!h-28 !w-full sm:!h-36" />
      <div className="p-2.5 sm:p-3">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </div>
  );
};

export default SkeletonCard;
