import React from "react";
import { Card } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";

const StatCard = ({ icon, title, value, footer, footerIcon }) => {
  const isImageIcon = typeof icon === "string";

  return (
    <Card
      className={`rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:drop-shadow-md ${
        title === "Total Orders"
          ? "!bg-[#D6FADB]"
          : title === "Completed Orders"
            ? "!bg-[#B4FFC0]"
            : "!bg-[#FFFAE6]"
      }`}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-sm font-semibold break-words text-gray-500 sm:text-base">{title}</p>
        </div>

        <div className="flex items-end gap-3 sm:gap-4">
          <div
            className={`shrink-0 rounded-lg p-2 sm:rounded-[10px] sm:p-3 ${
              title === "Completed Orders"
                ? "bg-[#90FD9F]"
                : title === "Orders being prepared"
                  ? "bg-[#FFE7D2]"
                  : "bg-[#B4FFC0]"
            }`}
          >
            {isImageIcon ? (
              <img src={icon} className="h-8 w-8 object-contain sm:h-10 sm:w-10" alt={title} />
            ) : (
              <HugeiconsIcon
                icon={icon}
                size={40}
                className={`h-8 w-8 sm:h-10 sm:w-10 ${
                  title === "Completed Orders" ? "text-[#1F5226]" : "text-[#FF0000]"
                }`}
              />
            )}
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            <h3
              className={`text-2xl font-bold break-words sm:text-3xl lg:text-4xl ${
                title === "Total Orders"
                  ? "text-primary"
                  : title === "Completed Orders"
                    ? "text-primary"
                    : "text-[#F5AB0A]"
              }`}
            >
              {value}
            </h3>
            {footer && (
              <div
                className={`mt-1.5 inline-flex max-w-full items-center gap-1 rounded-xl px-2 py-1 sm:mt-2 sm:rounded-[16px] sm:px-3 ${
                  title === "Total Orders"
                    ? "bg-[#B4FFC0] text-[#43794B]"
                    : title === "Completed Orders"
                      ? "bg-[#90FD9F] text-[#43794B]"
                      : "bg-[#FFD2D8] text-[#D40707]"
                }`}
              >
                {footerIcon && (
                  <HugeiconsIcon icon={footerIcon} size={12} className="shrink-0" />
                )}
                <p className="truncate text-xs sm:text-sm">{footer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
