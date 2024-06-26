import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import authDepot from '../services/slices/authSlice';
import feedDepot from '../services/slices/feedSlice';
import ingredientsDepot from '../services/slices/ingredientsSlice';
import orderDepot from '../services/slices/orderSlice';
import userOrdersDepot from '../services/slices/userOrdersSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsDepot.reducer,
    order: orderDepot.reducer,
    auth: authDepot.reducer,
    feed: feedDepot.reducer,
    userOrders: userOrdersDepot.reducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
