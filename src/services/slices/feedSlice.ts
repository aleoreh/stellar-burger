import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

export interface FeedState {
  orders: TOrder[];
  pending: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  pending: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    noop: (x) => x
  },
  selectors: {
    selectFeed: (state) => state
  },
  extraReducers: (builder) =>
    builder
      .addCase(getFeeds.pending, (state) => {
        state.error = null;
        state.pending = true;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.pending = false;
        state.error =
          action.error.message ||
          'Не удалось получить список заказов. Попробуйте получить его позже';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.pending = false;
        state.error = null;
        state.orders = action.payload.orders;
      })
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const feedDepot = {
  reducer: feedSlice.reducer,
  ...feedSlice.actions,
  ...feedSlice.selectors
};

export default feedDepot;
