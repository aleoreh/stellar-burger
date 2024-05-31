import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../app/store';
import authDepot from '../../services/slices/authSlice';
import orderDepot, { orderBurger } from '../../services/slices/orderSlice';
import feedDepot from '../../services/slices/feedSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(authDepot.selectIsLoggedIn);
  const constructorItems = useSelector(orderDepot.selectConstructorItems);
  const bun = useSelector(orderDepot.selectBun);
  const ingredients = useSelector(orderDepot.selectIngredients);
  const ids = useSelector(orderDepot.selectIds);
  const isReady = useSelector(orderDepot.selectIsReady);
  const sendingOrder = useSelector(orderDepot.selectSendingOrder);

  useEffect(() => {
    if (!sendingOrder) return;

    dispatch(feedDepot.getFeeds());
  }, [sendingOrder]);

  const orderRequest = false;

  const orderModalData = sendingOrder;

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    dispatch(orderBurger(ids));
  };

  const closeOrderModal = () => {
    dispatch(orderDepot.clear());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isReady={isReady}
    />
  );
};
