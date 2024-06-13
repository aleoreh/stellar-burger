import { PayloadAction, configureStore, createAction } from '@reduxjs/toolkit';
import authDepot from '../services/slices/authSlice';
import feedDepot from '../services/slices/feedSlice';
import ingredientsDepot, {
  fetchIngredients
} from '../services/slices/ingredientsSlice';
import orderDepot from '../services/slices/orderSlice';
import userOrdersDepot from '../services/slices/userOrdersSlice';
import { TIngredient } from '../utils/types';

type RootState = ReturnType<typeof store.getState>;

const createStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsDepot.reducer,
      order: orderDepot.reducer,
      auth: authDepot.reducer,
      feed: feedDepot.reducer,
      userOrders: userOrdersDepot.reducer
    },
    devTools: process.env.NODE_ENV !== 'production'
  });

let store = createStore();

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

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  }
];

const dispatchAction = <T>(
  action: PayloadAction<T>,
  initialState?: RootState
) => {
  const initialState_ = initialState || store.getState();

  store.dispatch(action);

  return { initialState: initialState_, currentState: store.getState() };
};

beforeEach(() => {
  store = createStore();
});

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
      orderDepot.addIngredient(mockIngredients[0])
    );

    const currentIngredients = orderDepot.selectIngredients(currentState);

    expect(currentIngredients.length).toBe(1);

    expect(currentIngredients[0]._id).toEqual(mockIngredients[0]._id);
  });

  it('может удалать ингредиент', () => {
    const { currentState: initialState } = dispatchAction(
      orderDepot.addIngredient(mockIngredients[0])
    );
    const initialIngredients = orderDepot.selectIngredients(initialState);

    const { currentState } = dispatchAction(
      orderDepot.deleteIngredient(initialIngredients[0].id)
    );
    const currentIngredients = orderDepot.selectIngredients(currentState);

    // длина уменьшается не единицу
    expect(currentIngredients.length).toBe(initialIngredients.length - 1);

    // удалённый ингредиент отсутствует в массиве
    expect(
      currentIngredients.find((x) => x.id === initialIngredients[0].id)
    ).toBe(undefined);
  });

  it('может изменять порядок ингредиентов', () => {
    mockIngredients.forEach((x) => dispatchAction(orderDepot.addIngredient(x)));

    const initialState = store.getState();
    const initialIngredients = orderDepot.selectIngredients(initialState);

    const { currentState } = dispatchAction(orderDepot.moveDown(0));
    const currentIngredients = orderDepot.selectIngredients(currentState);

    expect(currentIngredients[0].id).toBe(initialIngredients[1].id);
  });
});

describe('Срез "ingredients" в асинхронных действиях', () => {
  it('устанавливает ожидание при вызове действия', () => {
    const { currentState } = dispatchAction(fetchIngredients.pending(''));
    const isPending = ingredientsDepot.selectIsPending(currentState);

    expect(isPending).toBe(true);
  });

  it('устанавливает ошибку при неуспешном выполнении действия', () => {
    const errorText = 'ошибка';
    const { currentState } = dispatchAction(
      fetchIngredients.rejected(new Error(errorText), '')
    );
    const error = ingredientsDepot.selectError(currentState);

    expect(error).toBe(errorText);
  });

  it('устанавливает состояние при успешном выполнении действия', () => {
    const { currentState } = dispatchAction(
      fetchIngredients.fulfilled(mockIngredients, '')
    );
    const currentIngredients = ingredientsDepot.selectIngredients(currentState);

    expect(currentIngredients).toEqual(mockIngredients);
  });
});
