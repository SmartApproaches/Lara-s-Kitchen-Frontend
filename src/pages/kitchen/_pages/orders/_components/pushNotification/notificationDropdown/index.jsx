import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  markAsRead,
  toggleSound,
  clearNewFlags,
} from "../../../../../../../redux/slices/notification/notificationsSlice";

import { Switch } from "antd";
import NotificationCard from "..";

const NotificationsDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, soundEnabled } = useSelector((s) => s.notifications);

  const [tab, setTab] = useState("all");
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const audioRef = useRef(null);
  const prevCount = useRef(items.length);

  // Load audio
  useEffect(() => {
    const audio = new Audio("/notification.wav");
    audio.preload = "auto";
    audioRef.current = audio;
    audio.load();
  }, []);

  // FORCE unlock audio when user toggles ON
  const handleToggle = async () => {
    if (!audioUnlocked && audioRef.current) {
      try {
        audioRef.current.volume = 0;

        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        audioRef.current.volume = 1;
        setAudioUnlocked(true);
      } catch (e) {
        console.warn("Audio unlock failed:", e);
      }
    }

    dispatch(toggleSound());
  };

  // Play sound on new notifications
  useEffect(() => {
    if (!soundEnabled || !audioRef.current || !audioUnlocked) return;

    if (items.length > prevCount.current) {
      audioRef.current.currentTime = 0;

      audioRef.current.play().catch((e) => {
        console.warn("Notification sound blocked:", e);
      });
    }

    prevCount.current = items.length;
  }, [items.length, soundEnabled, audioUnlocked]);

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => !n.read);
  }, [items, tab]);

  // Cleanup "_isNew"
  useEffect(() => {
    const newItems = items.filter((item) => item._isNew);

    if (newItems.length > 0) {
      const timer = setTimeout(() => {
        dispatch(clearNewFlags());
      }, 700);

      return () => clearTimeout(timer);
    }
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
              onClick={() => dispatch(markAsRead(note.id))}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
