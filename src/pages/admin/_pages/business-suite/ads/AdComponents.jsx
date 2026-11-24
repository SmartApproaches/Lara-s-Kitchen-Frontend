import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { getAdState } from "./adUtils";

export const AdStateLabel = ({ ad }) => {
  const state = getAdState(ad);
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: state.bg, color: state.color }}
    >
      {state.label}
    </span>
  );
};

export const PageHeader = ({ title, backTo, children }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          aria-label="Back"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} />
        </button>
        <h1 className="text-2xl font-bold text-black md:text-3xl">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
};
