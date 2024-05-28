import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

const selectOrder = (state: FeedState) => (_id: string) =>
  state.orders.find((x) => x._id === _id);

export interface FeedState {
  orders: TOrder[];
  total: number | undefined;
  totalToday: number | undefined;
  pending: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: undefined,
  totalToday: undefined,
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
    selectFeed: (state) => state,
    selectOrders: (state) => state.orders
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
      .addCase(getFeeds.fulfilled, (state, action) => ({
        ...state,
        pending: false,
        error: null,
        ...action.payload
      }))
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

// ~~~~~~~~~~~~~~~ helpers ~~~~~~~~~~~~~~~ //

export const getFeedOrderByNumber = (
  orders: FeedState['orders'],
  number: TOrder['number']
) => orders.find((x) => x.number === number);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const feedDepot = {
  reducer: feedSlice.reducer,
  ...feedSlice.actions,
  ...feedSlice.selectors,
  getOrderByNumber: getFeedOrderByNumber
};

export default feedDepot;
