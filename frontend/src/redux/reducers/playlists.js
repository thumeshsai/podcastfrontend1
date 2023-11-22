/* eslint-disable no-unused-vars */
// playlistSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const playlistSlice = createSlice({
  name: "playlists",
  initialState: {},
  reducers: {
    setPlaylists: (state, action) => action.payload,
    clearPlaylists: (state) => null,
  },
});

export const { setPlaylists, clearPlaylists } = playlistSlice.actions;

// Selectors
export const selectPlaylists = (state) => state.playlists;

// Action creators
export const useSetPlaylists = () => {
  const dispatch = useDispatch();
  return (playlistData) => dispatch(setPlaylists(playlistData));
};

export const useClearPlaylists = () => {
  const dispatch = useDispatch();
  return () => dispatch(clearPlaylists());
};

export const usePlaylistsSelector = () => useSelector(selectPlaylists);

export default playlistSlice.reducer;