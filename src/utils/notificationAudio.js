// src/utils/notificationAudio.js
let audio = null;
let unlocked = false;

export const initNotificationAudio = () => {
  if (!audio) {
    audio = new Audio("/laras_kitchen_notification.wav");
    audio.preload = "auto";
  }
};

export const unlockAudio = async () => {
  if (unlocked) return;

  try {
    // Unlock regular notification
    if (!audio) {
      audio = new Audio("/laras_kitchen_notification.wav");
      audio.preload = "auto";
    }
    audio.volume = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;

    // Unlock urgent notification
    if (!urgentAudio) {
      urgentAudio = new Audio("/mixkit-elevator-tone-2863.wav");
      urgentAudio.preload = "auto";
      urgentAudio.loop = true;
    }
    urgentAudio.volume = 0;
    await urgentAudio.play();
    urgentAudio.pause();
    urgentAudio.currentTime = 0;
    urgentAudio.volume = 1;

    unlocked = true;
  } catch (error) {
    console.warn("Audio unlock blocked:", error);
  }
};

export const playNotificationSound = () => {
  if (!audio || !unlocked) return;

  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {}
};

export const stopNotificationSound = () => {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
};

let urgentAudio = null;

export const playUrgentNotificationSound = () => {
  if (!urgentAudio) {
    urgentAudio = new Audio("/mixkit-elevator-tone-2863.wav");
    urgentAudio.loop = true;
  }
  
  if (!unlocked) return;

  if (urgentAudio.paused) {
    urgentAudio.currentTime = 0;
    urgentAudio.play().catch((err) => {
      console.warn("Error playing urgent sound:", err);
    });
  }
};

export const stopUrgentNotificationSound = () => {
  if (!urgentAudio) return;
  urgentAudio.pause();
  urgentAudio.currentTime = 0;
};
