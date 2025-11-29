import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ToastNotification from "./ToastNotification";
import { markAsRead } from "../../../../../../../../redux/slices/notification/notificationsSlice";

const ToastNotificationContainer = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items || []);

  const [toastNotifications, setToastNotifications] = useState([]);
  const audioRef = useRef(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Load toast audio
  useEffect(() => {
    const audio = new Audio("/notification.wav");
    audio.preload = "auto";
    audio.load();
    audioRef.current = audio;
  }, []);

  /**
   * 🔓 UNLOCK AUDIO ON FIRST USER INTERACTION
   * This is required for autoplay sound to work.
   * Browsers block sound until the user interacts with the page.
   */
  useEffect(() => {
    if (audioUnlocked) return;

    const unlock = async () => {
      if (!audioRef.current) return;

      try {
        audioRef.current.volume = 0;
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1;

        setAudioUnlocked(true);
      } catch (err) {
        // Fail silently; will try again on next interaction
      }
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("scroll", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, [audioUnlocked]);

  /** 🔊 Play sound when new toast notifications appear */
  const playToastSound = () => {
    if (!audioUnlocked || !audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    const newToasts = notifications.filter((n) => n._isNew && !n.read);

    if (newToasts.length > 0) {
      playToastSound(); // 🔊 fixed: now works without toggle
    }

    setToastNotifications(newToasts.slice(0, 3));
  }, [notifications, audioUnlocked]);

  const handleToastClick = (notification) => {
    dispatch(markAsRead(notification.id));
  };

  const handleDismiss = (id) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (toastNotifications.length === 0) return null;

  return (
    <div className="toast-notifications-container">
      {toastNotifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onClose={handleToastClick}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default ToastNotificationContainer;
