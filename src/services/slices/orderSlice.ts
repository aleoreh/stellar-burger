import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';
import { RemoteData, remoteData } from '../../utils/remote-data';

// ~~~~~~~~~~~~~~~ helpers ~~~~~~~~~~~~~~~ //

/**
 * Перемещает элемент массива на заданное количество позиций
 *
 * Осторожно, изменяет переданный массив!
 */
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
  _id: string;
  bun: TIngredient | undefined;
  ingredients: TConstructorIngredient[];
  sendingOrder: RemoteData<TOrder>;
}

const initialState: OrderState = {
  _id: '1',
  bun: undefined,
  ingredients: [],
  sendingOrder: remoteData.notAsked()
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    putBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newId = String(parseInt(state._id) + 1);
      state.ingredients = [
        ...state.ingredients,
        { ...action.payload, id: newId }
      ];
      state._id = newId;
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
    selectBun: (state) => state.bun,
    selectIngredients: (state) => state.ingredients,
    selectIsOrderSending: (state) => remoteData.isWaiting(state.sendingOrder),
    selectOrderSengingError: (state) =>
      remoteData.getRejectedWithDefault(state.sendingOrder, null),
    selectSendingOrder: (state) =>
      remoteData.getWithDefault(state.sendingOrder, null),
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
        state.sendingOrder = remoteData.waiting();
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.sendingOrder = remoteData.rejected(
          action.error.message ||
            'Не удалось отправить заказ. Повторите попытку позже'
        );
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.sendingOrder = remoteData.fulfilled(action.payload.order);
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
