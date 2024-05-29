import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import {
  RemoteData,
  fulfilled,
  isFulfilled,
  notAsked,
  rejected,
  remoteData,
  waiting
} from '../../utils/remote-data';
import { TOrder } from '../../utils/types';

export interface UserOrdersState {
  orders: RemoteData<TOrder[]>;
}

const initialState: UserOrdersState = {
  orders: notAsked()
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    noop: (state) => state
  },
  selectors: {
    selectIsPending: (state) => remoteData.isWaiting(state.orders),
    selectIsError: (state) => remoteData.isRejected(state.orders),
    selectOrdersValue: (state) =>
      isFulfilled(state.orders) ? remoteData.getValue(state.orders) : []
  },
  extraReducers: (builder) =>
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.orders = waiting();
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.orders = rejected(
          action.error.message ||
            'Не удалось получить заказы пользователся. Повторите попытку позже'
        );
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = fulfilled(action.payload);
      })
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  getOrdersApi
);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const userOrdersDepot = {
  reducer: userOrdersSlice.reducer,
  ...userOrdersSlice.actions,
  ...userOrdersSlice.selectors,
  getUserOrders
};

export default userOrdersDepot;
