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

  // ✅ SAFE selector with fallback
  const { items, soundEnabled } = useSelector(
    (state) => state.notifications ?? { items: [], soundEnabled: true },
  );

  const [tab, setTab] = useState("all");
  const prevCount = useRef(items.length);

  /** ✅ Init audio once */
  useEffect(() => {
    initNotificationAudio();
  }, []);

  /** 🔊 Toggle sound */
  const handleToggle = async () => {
    await unlockAudio();
    dispatch(toggleSound());

    if (soundEnabled) {
      stopNotificationSound();
    }
  };

  /** 🔔 Play sound on new notifications */
  useEffect(() => {
    if (!soundEnabled) return;

    if (items.length > prevCount.current) {
      playNotificationSound();
    }

    prevCount.current = items.length;
  }, [items.length, soundEnabled]);

  /** ✅ Filter notifications */
  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => !n.read);
  }, [items, tab]);

  /** 🧹 Clear `_isNew` flags safely */
  useEffect(() => {
    if (!items.length) return;

    const hasNew = items.some((n) => n._isNew);
    if (!hasNew) return;

    const timer = setTimeout(() => {
      dispatch(clearNewFlags());
    }, 700);

    return () => clearTimeout(timer);
  }, [items, dispatch]);

  return (
    <div className="notifications-dropdown animate-fade-in-down">
      <div className="notifications-header">
        <h3>Notifications</h3>

        <div className="sound-toggle">
          <span>Sound</span>
          <Switch checked={soundEnabled} onChange={handleToggle} size="small" />
        </div>
      </div>

      <div className="notifications-tabs">
        <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
          All
        </button>

        <button className={tab === "unread" ? "active" : ""} onClick={() => setTab("unread")}>
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
                stopNotificationSound();
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
