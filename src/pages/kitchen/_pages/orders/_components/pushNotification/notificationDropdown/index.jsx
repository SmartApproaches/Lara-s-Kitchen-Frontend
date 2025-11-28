// src/components/notifications/NotificationsDropdown.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAllRead,
  markAsRead,
  clearNotifications,
  toggleSound,
} from "../../../../../../../redux/slices/notification/notificationsSlice";

import { Switch } from "antd";
import NotificationCard from "..";

const NotificationsDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, soundEnabled } = useSelector((s) => s.notifications);
  const [tab, setTab] = useState("all");
  const audioRef = useRef(null);
  const prevCount = useRef(items.length);

  useEffect(() => {
    audioRef.current = new Audio("/notification.wav");
    audioRef.current.load();
  }, []);

  // play sound when a new notification arrives
  useEffect(() => {
    if (!soundEnabled) return;
    if (items.length > prevCount.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch (e) {}
    }
    prevCount.current = items.length;
  }, [items.length, soundEnabled]);

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => !n.read);
  }, [items, tab]);

  const handleOpenNote = (note) => {
    dispatch(markAsRead(note.id));
  };

  return (
    <div className="notifications-dropdown animate-fade-in-down">
      <div className="notifications-header">
        <h3 className="notifications-title">Notification</h3>
        <div className="notifications-actions">
          <div className="sound-toggle">
            <span className="sound-label">Sound</span>
            <Switch checked={soundEnabled} onChange={() => dispatch(toggleSound())} size="small" />
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
            <NotificationCard key={note.id} note={note} onClick={handleOpenNote} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
