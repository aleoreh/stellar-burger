import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export interface IngredientsState {
  isLoading: boolean;
  error: string | null;
  ingredients: TIngredient[];
}

const initialState: IngredientsState = {
  isLoading: false,
  error: null,
  ingredients: []
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    noop: (state) => state
  },
  selectors: {
    selectBuns: (state) => state.ingredients.filter((x) => x.type === 'bun'),
    selectMains: (state) => state.ingredients.filter((x) => x.type === 'main'),
    selectSauces: (state) =>
      state.ingredients.filter((x) => x.type === 'sauce'),
    selectFetchState: (state) => ({
      isLoading: state.isLoading,
      error: state.error,
      hasError: state.error !== null
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось получить ингредиенты';
        state.ingredients = initialState.ingredients;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients.push(...action.payload);
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
