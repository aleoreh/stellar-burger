import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

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
    putBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
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
