import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { RemoteData, remoteData } from '../../utils/remote-data';
import { TOrder } from '../../utils/types';

export interface FeedState {
  orders: RemoteData<TOrder[]>;
  total: number | undefined;
  totalToday: number | undefined;
}

const initialState: FeedState = {
  orders: remoteData.notAsked(),
  total: undefined,
  totalToday: undefined
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    noop: (x) => x
  },
  selectors: {
    selectIsPending: (state) => remoteData.isWaiting(state.orders),
    selectError: (state) =>
      remoteData.getRejectedWithDefault(state.orders, null),
    selectOrders: (state) => remoteData.getWithDefault(state.orders, null),
    selectFeed: (state) =>
      remoteData.isFulfilled(state.orders)
        ? { ...state.orders, orders: remoteData.getValue(state.orders) }
        : { orders: [], total: undefined, totalToday: undefined }
  },
  extraReducers: (builder) =>
    builder
      .addCase(getFeeds.pending, (state) => {
        state.orders = remoteData.waiting();
        state.total = undefined;
        state.totalToday = undefined;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.orders = remoteData.rejected(
          action.error.message ||
            'Не удалось получить список заказов. Попробуйте получить его позже'
        );
        state.total = undefined;
        state.totalToday = undefined;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = remoteData.fulfilled(action.payload.orders);
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

// ~~~~~~~~~~~~~~~ helpers ~~~~~~~~~~~~~~~ //

export const getFeedOrderByNumber = (orders: TOrder[], number: number) =>
  orders.find((x) => x.number === number);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const feedDepot = {
  reducer: feedSlice.reducer,
  ...feedSlice.actions,
  ...feedSlice.selectors,
  getOrderByNumber: getFeedOrderByNumber,
  getFeeds
};

export default feedDepot;
