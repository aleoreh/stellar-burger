import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import { Preloader } from '../../components/ui';
import authDepot from '../../services/slices/authSlice';
import userOrdersDepot from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const auth = useSelector(authDepot.selectAuth);
  const orders = useSelector(userOrdersDepot.selectOrdersValue);
  const isPending = useSelector(userOrdersDepot.selectIsPending);

  useEffect(() => {
    dispatch(userOrdersDepot.getUserOrders());
  }, [auth.user]);

  return isPending ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
