import { TIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../app/store';
import feedDepot from '../../services/slices/feedSlice';
import ingredientsDepot from '../../services/slices/ingredientsSlice';
import userOrdersDepot from '../../services/slices/userOrdersSlice';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  const { number: numberStr } = useParams<{ number: string }>();
  const number = numberStr === undefined ? undefined : parseInt(numberStr);
  if (number === undefined || isNaN(number)) return null;

  const ingredients = useSelector(ingredientsDepot.selectIngredients) || [];

  const userOrders = useSelector(userOrdersDepot.selectOrders) || [];
  const feedOrders = useSelector(feedDepot.selectOrders) || [];
  const orderData =
    feedDepot.getOrderByNumber(userOrders, number) ||
    feedDepot.getOrderByNumber(feedOrders, number);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
