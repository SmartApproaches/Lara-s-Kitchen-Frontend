// src/redux/slices/notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  items: [], // { id, title, body, data, read, createdAt }
  soundEnabled: true,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action) {
        const note = action.payload;
        state.items.unshift(note);
      },
      prepare(payload) {
        return {
          payload: {
            id: uuidv4(),
            title: payload.title || "Notification",
            body: payload.body || "",
            data: payload.data || {},
            read: false,
            createdAt: payload.createdAt || new Date().toISOString(),
          },
        };
      },
    },
    markAsRead(state, action) {
      const id = action.payload;
      const note = state.items.find((n) => n.id === id);
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
    },
  },
});

export const { addNotification, markAsRead, markAllRead, clearNotifications, toggleSound } =
  notificationsSlice.actions;

export default notificationsSlice;
