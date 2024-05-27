import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import Debug from '../../debug-log.debug';

// ~~~~~~~~~~~~~~~ helpers ~~~~~~~~~~~~~~~ //

const generateId = (ingredients: TConstructorIngredient[]): string => {
  if (ingredients.length === 0) return '1';

  const maxId = [...ingredients].sort((x, y) => (x.id > y.id ? -1 : 1))[0].id;

  return String(parseInt(maxId) + 1);
};

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

export interface BurgerState {
  bun: TIngredient | undefined;
  ingredients: TConstructorIngredient[];
}

const initialState: BurgerState = {
  bun: undefined,
  ingredients: []
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    noop: (state) => state,
    putBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients = [
        ...state.ingredients,
        { ...action.payload, id: generateId(state.ingredients) }
      ];
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient['id']>
    ) => {
      state.ingredients = state.ingredients.filter(
        (x) => x.id !== action.payload
      );
    }
  },
  selectors: {
    selectConstructorItems: (state) => state
  }
});

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const burgerDepot = {
  reducer: burgerSlice.reducer,
  ...burgerSlice.actions,
  ...burgerSlice.selectors
};

export default burgerDepot;
