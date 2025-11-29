import React, { useEffect, useState } from "react";
import { Notification01Icon, Cancel01Icon } from "hugeicons-react";

const ToastNotification = ({ notification, onClose, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Match exit animation duration
  };

  const handleClick = () => {
    onClose(notification);
    handleDismiss();
  };

  const orderId =
    notification.data?.order_number ||
    notification.data?.order_number ||
    (notification.body || "").slice(0, 12);
  const orderType =
    notification.data?.order_type === "dine_in" ? "Dine In" : notification.data?.order_type;
  const itemCount = notification.data?.order_items_count || notification.data?.order_items_count;

  return (
    <div
      className={`toast-notification ${isExiting ? "exiting" : "entering"}`}
      onClick={handleClick}
    >
      <div className="toast-indicator" />
      <div className="toast-progress" />

      <div className="toast-content">
        <div className="toast-icon-wrapper">
          <Notification01Icon className="toast-icon" />
        </div>

        <div className="toast-text">
          <p className="toast-title">{notification.title}</p>
          <p className="toast-order">Order {orderId}</p>
        </div>
      </div>

      <div className="toast-meta">
        <div className="toast-badges">
          <span className="toast-badge toast-badge-items">{itemCount || "—"} Items</span>
          <span className="toast-badge toast-badge-type">{orderType || "—"}</span>
        </div>
      </div>

      <button
        className="toast-close"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
      >
        <Cancel01Icon size={16} />
      </button>
    </div>
  );
};

export default ToastNotification;
