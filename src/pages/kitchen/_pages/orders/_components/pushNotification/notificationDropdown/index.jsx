import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  toggleSound,
  clearNewFlags,
} from "../../../../../../../redux/slices/notification/notificationsSlice";
import {
  initNotificationAudio,
  playNotificationSound,
  stopNotificationSound,
  unlockAudio,
} from "../../../../../../../utils/notificationAudio";
import { Switch } from "antd";
import NotificationCard from "..";

const NotificationsDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, soundEnabled } = useSelector((s) => s.notifications);

  const [tab, setTab] = useState("all");
  const prevCount = useRef(items.length);

  /** ✅ Init global notification audio once */
  useEffect(() => {
    initNotificationAudio();
  }, []);

  /** ✅ Global sound toggle */
  const handleToggle = async () => {
    await unlockAudio();
    dispatch(toggleSound());

    if (soundEnabled) {
      stopNotificationSound(); // ✅ stop immediately when turning OFF
    }
  };

  /** ✅ Play sound on new notifications */
  useEffect(() => {
    if (!soundEnabled) return;

    if (items.length > prevCount.current) {
      playNotificationSound();
    }

    prevCount.current = items.length;
  }, [items.length, soundEnabled]);

  /** ✅ Filter logic */
  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => !n.read);
  }, [items, tab]);

  /** ✅ Cleanup `_isNew` flags */
  useEffect(() => {
    const newItems = items.filter((item) => item._isNew);

    if (!newItems.length) return;

    const timer = setTimeout(() => {
      dispatch(clearNewFlags());
    }, 700);

    return () => clearTimeout(timer);
  }, [items, dispatch]);

  return (
    <div className="notifications-dropdown animate-fade-in-down">
      <div className="notifications-header">
        <h3 className="notifications-title">Notification</h3>

        <div className="notifications-actions">
          <div className="sound-toggle">
            <span className="sound-label">Sound</span>
            <Switch checked={soundEnabled} onChange={handleToggle} size="small" />
          </div>
        </div>
      </div>

      <div className="notifications-tabs">
        <button
          className={`tab-btn ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          All
        </button>

        <button
          className={`tab-btn ${tab === "unread" ? "active" : ""}`}
          onClick={() => setTab("unread")}
        >
          Unread ({items.filter((n) => !n.read).length})
        </button>
      </div>

      <div className="notifications-list">
        {filtered.length === 0 ? (
          <p className="empty-message">No notifications</p>
        ) : (
          filtered.map((note) => (
            <NotificationCard
              key={note.id}
              note={note}
              onClick={() => {
                stopNotificationSound(); // ✅ stop sound on click
                dispatch(markAsRead(note.id));
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
