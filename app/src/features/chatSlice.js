import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpService } from "../services/http.service";

const initialState = {
  chat: {Rabbit: [],
      Turtle: [],
      General: [],
      Announcements: [],},
};

export const fetchChat = createAsyncThunk(
  "fetchChat",
  async (chainId) => {
    const chats = await httpService.get(`chat/${chainId}`);
    return chats
  })

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMsg(state, action) {
      state.chat[action.payload.room].push(action.payload);
      state.chat = state.chat
    },
  },
  extraReducers(builder) {
    builder
    .addCase(fetchChat.fulfilled, (state, action) => {
      state.chat = action.payload;
    })
  }
});

export const selectAllChat = (state) => state.chat.chat;

export const {addMsg} = chatSlice.actions

export default chatSlice.reducer;
