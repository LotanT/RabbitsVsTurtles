import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { httpService } from "../services/http.service";

const initialState = {
  pastEvents: [],
  status: "idle",
  error: null,
};

export const fetchPastEvents = createAsyncThunk(
  "fetchPastEvents",
  async (info) => {
    let allPastEvents = []
    console.time("checkTime");
    // console.log('pastEvents');
    // const currBlock = await info.web3.eth.getBlockNumber();
    // let block = 29274986;
    // const gap = 3499;
    // let requests = [];
    // while (block < currBlock) {
    //   requests.push(
    //     info.contract.getPastEvents("allEvents", {
    //       fromBlock: block,
    //       toBlock: block + gap,
    //     })
    //   );
    //   block += gap;
    // }
    // const pastEvents = await Promise.all(requests);
    // for (let i = pastEvents.length; i > 0; i--) {
    //     allPastEvents = [...allPastEvents, ...pastEvents[i - 1]];
    // }
    // console.log(JSON.stringify(allPastEvents));
    console.log(info.contractJSON.address);
    allPastEvents = await httpService.get(`events/${info.contractJSON.address}`)
    console.timeEnd("checkTime");
    allPastEvents.sort((a, b) => b.blockNumber - a.blockNumber);
    return allPastEvents;
  }
);

const pastEventsSlice = createSlice({
  name: "pastEvents",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPastEvents.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPastEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pastEvents = action.payload;
      })
      .addCase(fetchPastEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllPastEvents = (state) => state.pastEvents.pastEvents;
export const getPastEventsStatus = (state) => state.pastEvents.status;
export const getPastEventsError = (state) => state.pastEvents.error;

export default pastEventsSlice.reducer;
