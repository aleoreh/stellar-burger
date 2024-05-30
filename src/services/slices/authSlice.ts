import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

export interface AuthState {
  user: TUser | null;
  // TODO: лучше разделить флаги для каждого асинхронного действия
  isCheckingAuth: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isCheckingAuth: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    noop: (state) => state
  },
  selectors: {
    selectAuth: (state) => state,
    isLoggedIn: (state) => state.user !== null,
    selectUser: (state) => state.user,
    selectAsyncState: (state) => ({
      pending: state.isCheckingAuth,
      error: state.error
    })
  },
  extraReducers: (builder) => {
    builder
      // ~~~~~~~~~~~~~~ loginUser ~~~~~~~~~~~~~~ //
      .addCase(loginUser.pending, () => ({
        ...initialState,
        isCheckingAuth: true
      }))
      .addCase(loginUser.rejected, (state, action) => ({
        ...initialState,
        isCheckingAuth: false,
        error:
          action.error.message ||
          'Не удалось отправить запрос на авторизацию. Повторите попытку позже'
      }))
      .addCase(loginUser.fulfilled, (state, action) => ({
        ...state,
        error: null,
        user: action.payload.user,
        isCheckingAuth: false
      }))
      // ~~~~~~~~~~~~~ registerUser ~~~~~~~~~~~~ //
      .addCase(registerUser.pending, () => ({
        ...initialState,
        isCheckingAuth: true
      }))
      .addCase(registerUser.rejected, (state, action) => ({
        ...initialState,
        isCheckingAuth: false,
        error:
          action.error.message ||
          'Не удалось отправить запрос на авторизацию. Повторите попытку позже'
      }))
      .addCase(registerUser.fulfilled, (state, action) => ({
        ...state,
        error: null,
        user: action.payload.user,
        isCheckingAuth: false
      }))
      .addCase(updateUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.error =
          action.error.message ||
          'Не удалось отправить запрос на обновление. Повторите попытку позже';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.error = null;
        state.user = action.payload.user;
      })
      // ~~~~~~~~~~~~~~ logoutUser ~~~~~~~~~~~~~ //
      .addCase(logoutUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(loginLocally.fulfilled, (state, action) => {
        state.error = null;
        state.isCheckingAuth = false;
        state.user = action.payload;
      });
  }
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const loginLocally = createAsyncThunk('auth/loginLocally', () => {
  const localStorageToken = localStorage.getItem('refreshToken');
  const localStorageUser = localStorage.getItem('user');
  const user = localStorageUser && JSON.parse(localStorageUser);
  return user && localStorageToken ? user : null;
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  (data: TLoginData) =>
    loginUserApi(data)
      .then((res) => {
        setCookie('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        return res;
      })
      .catch((err) => {
        throw err;
      })
);

export const registerUser = createAsyncThunk(
  'auth/register',
  (data: TRegisterData) =>
    registerUserApi(data)
      .then((res) => {
        setCookie('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        return res;
      })
      .catch((err) => {
        throw err;
      })
);

export const updateUser = createAsyncThunk('auth/updateUser', updateUserApi);

export const logoutUser = createAsyncThunk('auth/logoutUser', () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  })
);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const authDepot = {
  reducer: authSlice.reducer,
  ...authSlice.actions,
  ...authSlice.selectors
};

export default authDepot;
