import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

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
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectFetchState: (state) => ({
      isLoading: state.isLoading,
      error: state.error,
      hasError: state.error !== null
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, () => ({
        ...initialState,
        isLoading: true
      }))
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось получить ингредиенты';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = action.payload;
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
