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
import {
  RemoteData,
  fulfilled,
  isWaiting,
  rejected,
  remoteData,
  waiting
} from '../../utils/remote-data';

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

export interface AuthState {
  user: RemoteData<TUser | null>;
}

const initialState: AuthState = {
  user: remoteData.notAsked()
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    selectIsPending: (state) => isWaiting(state.user),
    selectError: (state) => remoteData.getRejectedWithDefault(state.user, null),
    selectUser: (state) => remoteData.getWithDefault(state.user, null),
    selectIsLoggedIn: (state) =>
      remoteData.getWithDefault(state.user, null) !== null
  },
  extraReducers: (builder) => {
    builder
      // ~~~~~~~~~~~~~~ loginUser ~~~~~~~~~~~~~~ //
      .addCase(loginUser.pending, (state) => {
        state.user = remoteData.waiting();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = remoteData.rejected(
          action.error.message ||
            'Не удалось отправить запрос на авторизацию. Повторите попытку позже'
        );
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = remoteData.fulfilled(action.payload.user);
      })
      // ~~~~~~~~~~~~~ registerUser ~~~~~~~~~~~~ //
      .addCase(registerUser.pending, (state) => {
        state.user = waiting();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = rejected(
          action.error.message ||
            'Не удалось отправить запрос на авторизацию. Повторите попытку позже'
        );
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = fulfilled(action.payload.user);
      })
      .addCase(updateUser.pending, (state) => {
        state.user = waiting();
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.user = rejected(
          action.error.message ||
            'Не удалось отправить запрос на обновление. Повторите попытку позже'
        );
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = fulfilled(action.payload.user);
      })
      // ~~~~~~~~~~~~~~ logoutUser ~~~~~~~~~~~~~ //
      .addCase(logoutUser.pending, (state) => {
        state.user = waiting();
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(loginLocally.fulfilled, (state, action) => {
        state.user = fulfilled(action.payload);
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
