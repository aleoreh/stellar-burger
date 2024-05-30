import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';
import { RemoteData, remoteData } from '../../utils/remote-data';

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

export interface IngredientsState {
  ingredients: RemoteData<TIngredient[]>;
}

const initialState: IngredientsState = {
  ingredients: remoteData.notAsked()
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    noop: (state) => state
  },
  selectors: {
    selectIsPending: (state) => remoteData.isWaiting(state.ingredients),
    selectError: (state) =>
      remoteData.getRejectedWithDefault(state.ingredients, null),
    selectIngredients: (state) =>
      remoteData.getWithDefault(state.ingredients, null)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.ingredients = remoteData.waiting();
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.ingredients = remoteData.rejected(
          action.error.message || 'Не удалось получить ингредиенты'
        );
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = remoteData.fulfilled(action.payload);
      });
  }
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const ingredientsDepot = {
  reducer: ingredientsSlice.reducer,
  ...ingredientsSlice.actions,
  ...ingredientsSlice.selectors
};

export default ingredientsDepot;
