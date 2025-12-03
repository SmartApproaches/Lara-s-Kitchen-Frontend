let audio = null;
let unlocked = false;

export const initNotificationAudio = () => {
  if (!audio) {
    audio = new Audio("/laras_kitchen_notification.wav");
    audio.preload = "auto";
  }
};

export const unlockAudio = async () => {
  if (!audio || unlocked) return;

  try {
    audio.volume = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    unlocked = true;
  } catch (e) {
    console.warn("Audio unlock blocked");
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
