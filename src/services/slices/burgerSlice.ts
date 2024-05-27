import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';

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
  sending: boolean;
  sendingError: string | null;
  newOrder: TOrder | null;
}

const initialState: BurgerState = {
  bun: undefined,
  ingredients: [],
  sending: false,
  sendingError: null,
  newOrder: null
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
    selectConstructorItems: (state) => state,
    selectIds: (state): Array<TConstructorIngredient['_id']> =>
      [state.bun?._id || '', ...state.ingredients.map((x) => x._id)].filter(
        (x) => x !== ''
      )
  },
  extraReducers: (builder) =>
    builder
      .addCase(orderBurger.pending, (state) => {
        state.sending = true;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        (state.sending = false),
          (state.sendingError =
            'Не удалось отправить заказ. Повторите попытку позже');
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.sending = false;
        state.sendingError = null;
        state.newOrder = action.payload.order;
      })
});

// ~~~~~~~~~~~~~~~~ async ~~~~~~~~~~~~~~~~ //

export const orderBurger = createAsyncThunk(
  'burger/orderBurger',
  orderBurgerApi
);

// ~~~~~~~~~~~~~~~ exports ~~~~~~~~~~~~~~~ //

export const burgerDepot = {
  reducer: burgerSlice.reducer,
  ...burgerSlice.actions,
  ...burgerSlice.selectors
};

export default burgerDepot;
