// src/components/notifications/NotificationCard.jsx
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NotificationCard = ({ note, onClick, isExiting }) => {
  const orderId =
    note.data?.order_number || note.data?.order_number || (note.body || "").slice(0, 12);
  const orderType = note.data?.order_type === "dine_in" ? "Dine In" : note.data?.order_type;
  return (
    <div
      onClick={() => onClick && onClick(note)}
      className={`notification-card ${isExiting ? "notification-card-exit" : ""} ${!note.read ? "unread" : ""}`}
      style={{
        cursor: "pointer",
      }}
    >
      <div className="notification-indicator" />

      <div className="notification-content">
        <div className="notification-icon-wrapper">
          <svg
            className="notification-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
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
