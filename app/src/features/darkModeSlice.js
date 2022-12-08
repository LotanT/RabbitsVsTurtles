import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: true,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    switchDarkMode(state, action) {
      state.darkMode = !state.darkMode
    },
  },
});

export const selectAllDarkMode = (state) => state.darkMode.darkMode;

export const {switchDarkMode} = darkModeSlice.actions

export default darkModeSlice.reducer;
