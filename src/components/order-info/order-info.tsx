import { TIngredient, TOrder } from '@utils-types';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../app/store';
import feedDepot from '../../services/slices/feedSlice';
import ingredientsDepot from '../../services/slices/ingredientsSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  const { number: numberStr } = useParams<{ number: string }>();
  const number = numberStr === undefined ? undefined : parseInt(numberStr);
  if (number === undefined || isNaN(number)) return null;

  const [orderData, setOrderData] = useState<TOrder | undefined>(undefined);

  const ingredients = useSelector(ingredientsDepot.selectIngredients) || [];

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

  useEffect(() => {
    if (orderData && orderData.number === number) return;

    getOrderByNumberApi(number).then((res) => {
      setOrderData(feedDepot.getOrderByNumber(res.orders, number));
    });
  }, [orderData]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
