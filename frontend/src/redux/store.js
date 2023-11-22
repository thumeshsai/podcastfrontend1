// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import categoriesReducer from "./reducers/categories";
import playlistsReducer from "./reducers/playlists";

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    playlists: playlistsReducer,
  },
});

export default store;