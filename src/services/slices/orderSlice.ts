import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';

// ~~~~~~~~~~~~~~~ helpers ~~~~~~~~~~~~~~~ //

const generateId = (ingredients: TConstructorIngredient[]): string => {
  if (ingredients.length === 0) return '1';

  const maxId = [...ingredients].sort((x, y) => (x.id > y.id ? -1 : 1))[0].id;

  return String(parseInt(maxId) + 1);
};

const moveInPlace = (
  arr: Array<unknown>,
  srcIndex: number,
  destIndex: number
) => {
  var elem = arr.splice(srcIndex, 1)[0];
  arr.splice(destIndex, 0, elem);
};

// ~~~~~~~~~~~~~~~~ slice ~~~~~~~~~~~~~~~~ //

export interface OrderState {
  bun: TIngredient | undefined;
  ingredients: TConstructorIngredient[];
  sending: boolean;
  sendingError: string | null;
  newOrder: TOrder | null;
}

const initialState: OrderState = {
  bun: undefined,
  ingredients: [],
  sending: false,
  sendingError: null,
  newOrder: null
};

export const orderSlice = createSlice({
  name: 'order',
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
    },
    clear: () => initialState,
    moveUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index === 0) return;

      moveInPlace(state.ingredients, index, index - 1);
    },
    moveDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index === state.ingredients.length - 1) return;

      moveInPlace(state.ingredients, index, index + 1);
    }
  },
  selectors: {
    selectConstructorItems: (state) => state,
    selectIds: (state): Array<TConstructorIngredient['_id']> =>
      [
        state.bun?._id || '',
        ...state.ingredients.map((x) => x._id),
        state.bun?._id || ''
      ].filter((x) => x !== ''),
    selectIsReady: (state) => state.bun !== null && state.ingredients.length > 0
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

export const orderDepot = {
  reducer: orderSlice.reducer,
  ...orderSlice.actions,
  ...orderSlice.selectors
};

export default orderDepot;
