// src/redux/slices/notification/notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  items: [],

  // 🔊 Sound ON by default, persisted
  soundEnabled: JSON.parse(localStorage.getItem("notificationSound")) ?? true,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(payload) {
        return {
          payload: {
            id: uuidv4(),
            title: payload.title || "Notification",
            body: payload.body || "",
            data: payload.data || {},
            read: false,
            _isNew: true,
            createdAt: payload.createdAt || new Date().toISOString(),
          },
        };
      },
    },

    markAsRead(state, action) {
      const note = state.items.find((n) => n.id === action.payload);
      if (note) note.read = true;
    },

    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },

    clearNotifications(state) {
      state.items = [];
    },

    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem("notificationSound", JSON.stringify(state.soundEnabled));
    },

    clearNewFlags(state) {
      state.items = state.items.map((n) => ({
        ...n,
        _isNew: false,
      }));
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllRead,
  clearNotifications,
  toggleSound,
  clearNewFlags,
} = notificationsSlice.actions;

export default notificationsSlice;
