import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ToastNotification from "./ToastNotification";
import { markAsRead } from "../../../../../../../../redux/slices/notification/notificationsSlice";
import {
  initNotificationAudio,
  playNotificationSound,
  stopNotificationSound,
  unlockAudio,
} from "../../../../../../../../utils/notificationAudio";

const ToastNotificationContainer = () => {
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notifications?.items || []);
  const soundEnabled = useSelector((state) => state.notifications?.soundEnabled);

  const [toastNotifications, setToastNotifications] = useState([]);
  const prevToastIdsRef = useRef("");

  /** ✅ Init + Unlock global audio once */
  useEffect(() => {
    initNotificationAudio();

    const unlock = async () => {
      await unlockAudio();
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  /** ✅ Handle new toast notifications safely */
  useEffect(() => {
    const newToasts = notifications.filter((n) => n._isNew && !n.read).slice(0, 3);

    // 🔒 Prevent unnecessary state updates
    const newIds = newToasts.map((n) => n.id).join(",");
    if (newIds === prevToastIdsRef.current) return;

    prevToastIdsRef.current = newIds;

    setToastNotifications(newToasts);

    if (newToasts.length > 0 && soundEnabled) {
      playNotificationSound();
    } else {
      stopNotificationSound();
    }
  }, [notifications.length, soundEnabled]);

  /** ✅ Stop sound + mark as read */
  const handleToastClick = (notification) => {
    stopNotificationSound();
    dispatch(markAsRead(notification.id));
  };

  /** ✅ Dismiss only UI (not Redux state) */
  const handleDismiss = (id) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!toastNotifications.length) return null;

  return (
    <div className="toast-notifications-container">
      {toastNotifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onClose={() => handleToastClick(notification)}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default ToastNotificationContainer;
