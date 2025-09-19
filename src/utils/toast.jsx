import { Alert02Icon, InformationDiamondIcon } from "hugeicons-react";
import toast from "react-hot-toast";

export const customWarningToast = (message) => {
  return toast(message, {
    style: {
      background: "#f1c40f",
      color: "#fff",
      fontWeight: "bold",
    },
    duration: 6000,
    icon: <Alert02Icon size={16} color="#fff" strokeWidth={2.4} />,
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
    icon: <InformationDiamondIcon size={16} color="#222222" strokeWidth={2.4} />,
  });
};
