import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredientsDepot from '../services/slices/ingredientsSlice';
import burgerDepot from '../services/slices/burgerSlice';
import authDepot from '../services/slices/authSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsDepot.reducer,
    burger: burgerDepot.reducer,
    auth: authDepot.reducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
