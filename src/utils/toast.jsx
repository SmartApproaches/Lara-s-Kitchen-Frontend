import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, InformationDiamondIcon } from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";

export const customWarningToast = (message) => {
  return toast(message, {
    style: {
      background: "#f1c40f",
      color: "#fff",
      fontWeight: "bold",
    },
    duration: 6000,
    icon: <HugeiconsIcon icon={Alert01Icon} size={16} color="#fff" strokeWidth={2.4} />,
  });
};

export const customInfoToast = (message) => {
  return toast(message, {
    style: {
      background: "#d6fadb",
      color: "#222222",
      fontWeight: "bold",
    },
    duration: 6000,
    icon: (
      <HugeiconsIcon icon={InformationDiamondIcon} size={16} color="#222222" strokeWidth={2.4} />
    ),
  });
};
