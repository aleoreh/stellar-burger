import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserApi, registerUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

export interface AuthState {
  user: TUser | null;
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
    isLoggedIn: (state) => state.user !== null
  },
  extraReducers: (builder) => {
    builder
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
        ...action.payload,
        isCheckingAuth: false
      }));
  }
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const loginUser = createAsyncThunk('auth/loginUser', loginUserApi);

export const registerUser = createAsyncThunk('auth/register', registerUserApi);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const authDepot = {
  reducer: authSlice.reducer,
  ...authSlice.actions,
  ...authSlice.selectors
};

export default authDepot;
