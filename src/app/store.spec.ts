import { PayloadAction, createAction } from '@reduxjs/toolkit';
import store, { RootState } from './store';

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
