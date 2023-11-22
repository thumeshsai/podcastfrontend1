/* eslint-disable no-unused-vars */
// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: (state) => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user;

// Action creators
export const useSetUser = () => {
  const dispatch = useDispatch();
  return (userData) => dispatch(setUser(userData));
};

export const useClearUser = () => {
  const dispatch = useDispatch();
  return () => dispatch(clearUser());
};

export const useUserSelector = () => useSelector(selectUser);

export default userSlice.reducer;
