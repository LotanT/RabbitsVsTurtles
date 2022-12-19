import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connectionName: '',
};

const connectionNameSlice = createSlice({
  name: "connectionName",
  initialState,
  reducers: {
    updateConnectionName(state, action) {
      state.connectionName = action.payload
    },
  },
});

export const selectAllConnectionName = (state) => state.connectionName.connectionName;

export const {updateConnectionName} = connectionNameSlice.actions

export default connectionNameSlice.reducer;
