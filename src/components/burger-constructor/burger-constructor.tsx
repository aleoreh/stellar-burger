import { BurgerConstructorUI, Preloader } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../app/store';
import authDepot from '../../services/slices/authSlice';
import burgerDepot, { orderBurger } from '../../services/slices/burgerSlice';
import { orderBurgerApi } from '../../utils/burger-api';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(authDepot.isLoggedIn);
  const constructorItems = useSelector(burgerDepot.selectConstructorItems);
  const ids = useSelector(burgerDepot.selectIds);

  const orderRequest = false;

  const orderModalData = constructorItems.newOrder;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isLoggedIn) navigate('/login');

    dispatch(orderBurger(ids));
  };

  const closeOrderModal = () => {
    dispatch(burgerDepot.clear());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return constructorItems.sending ? (
    <Preloader />
  ) : constructorItems.sendingError !== null ? (
    <div>{constructorItems.sendingError}</div>
  ) : (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
