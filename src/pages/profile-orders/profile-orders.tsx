import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import { Preloader } from '../../components/ui';
import authDepot from '../../services/slices/authSlice';
import userOrdersDepot from '../../services/slices/userOrdersSlice';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(userOrdersDepot.selectOrders) || [];
  const isPending = useSelector(userOrdersDepot.selectIsPending);
  const user = useSelector(authDepot.selectUser);

  useEffect(() => {
    dispatch(userOrdersDepot.getUserOrders());
  }, [user]);

  return isPending ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
