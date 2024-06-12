import { PayloadAction, createAction } from '@reduxjs/toolkit';
import orderDepot from '../services/slices/orderSlice';
import { TIngredient } from '../utils/types';
import store, { RootState } from './store';

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'TEST! Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const dispatchAction = <T>(
  action: PayloadAction<T>,
  initialState?: RootState
) => {
  const initialState_ = initialState || store.getState();

  store.dispatch(action);

  return { initialState: initialState_, currentState: store.getState() };
};

describe('store', () => {
  it('проходит инициализацию', () => {
    const { initialState, currentState } = dispatchAction(
      createAction('UNKNOWN_ACTION')()
    );

    expect(currentState).toEqual(initialState);
  });
});

describe('Редуктор среза "order"', () => {
  it('может подставлять булочку', () => {
    const { currentState } = dispatchAction(orderDepot.putBun(mockBun));

    const currentBun = orderDepot.selectBun(currentState);

    expect(currentBun).toBeTruthy();
    expect(currentBun).toEqual(mockBun);
  });

  it('может добавлять ингредиент', () => {
    const { currentState } = dispatchAction(
      orderDepot.addIngredient(mockIngredient)
    );

    const currentIngredients = orderDepot.selectIngredients(currentState);

    expect(currentIngredients.length).toBe(1);

    expect(currentIngredients[0]._id).toEqual(mockIngredient._id);
  });

  it('может удалать ингредиент', () => {
    const { currentState: ingredientAddedState } = dispatchAction(
      orderDepot.addIngredient(mockIngredient)
    );
    const ingredientsAfterAdded =
      orderDepot.selectIngredients(ingredientAddedState);

    const { currentState: ingredientDeletedState } = dispatchAction(
      orderDepot.deleteIngredient(ingredientsAfterAdded[0].id)
    );
    const ingredientsAfterDelete = orderDepot.selectIngredients(
      ingredientDeletedState
    );

    // длина уменьшается не единицу
    expect(ingredientsAfterDelete.length).toBe(
      ingredientsAfterAdded.length - 1
    );

    // удалённый ингредиент отсутствует в массиве
    expect(
      ingredientsAfterDelete.find((x) => x.id === ingredientsAfterAdded[0].id)
    ).toBe(undefined);
  });
});
