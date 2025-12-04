import React, { useEffect, useState } from "react";
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
  const notifications = useSelector((state) => state.notifications.items || []);
  const soundEnabled = useSelector((state) => state.notifications.soundEnabled);

  const [toastNotifications, setToastNotifications] = useState([]);

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

  /** ✅ Show & play sound for new toast notifications */
  useEffect(() => {
    const newToasts = notifications.filter((n) => n._isNew && !n.read);

    if (newToasts.length > 0 && soundEnabled) {
      playNotificationSound();
    }

    setToastNotifications(newToasts.slice(0, 3));
  }, [notifications, soundEnabled]);

  /** ✅ Stop sound + mark as read */
  const handleToastClick = (notification) => {
    stopNotificationSound();
    dispatch(markAsRead(notification.id));
  };

  /** ✅ Dismiss only UI (not backend state) */
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
          onClose={() => handleToastClick(notification)}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default ToastNotificationContainer;
