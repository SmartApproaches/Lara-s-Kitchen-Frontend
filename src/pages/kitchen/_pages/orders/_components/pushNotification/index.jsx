import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Notification01Icon } from "hugeicons-react";
dayjs.extend(relativeTime);

const NotificationCard = ({ note, onClick }) => {
  const [isNew, setIsNew] = useState(note._isNew || false);

  // Remove the "new" class after animation completes
  useEffect(() => {
    if (note._isNew) {
      const timer = setTimeout(() => {
        setIsNew(false);
      }, 600); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [note._isNew]);

  const orderId =
    note.data?.order_number || note.data?.order_number || (note.body || "").slice(0, 12);
  const orderType = note.data?.order_type === "dine_in" ? "Dine In" : note.data?.order_type;

  return (
    <div
      onClick={() => onClick(note)}
      className={`notification-card ${isNew ? "new" : ""} ${!note.read ? "unread" : ""} cursor-pointer`}
    >
      <div className="notification-indicator" />

      <div className="notification-content">
        <div className="notification-icon-wrapper">
          <Notification01Icon className="notification-icon" />
        </div>

        <div className="notification-text">
          <p className="notification-title">{note.title}</p>
          <p className="notification-order">Order {orderId}</p>
        </div>
      </div>

      <div className="notification-meta">
        <p className="notification-time">{dayjs(note.createdAt).fromNow()}</p>
        <div className="notification-badges">
          <span className="badge badge-items">
            {note.data?.order_items_count || note.data?.order_items_count || "—"} Items
          </span>
          <span className="badge badge-type">{orderType || "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
