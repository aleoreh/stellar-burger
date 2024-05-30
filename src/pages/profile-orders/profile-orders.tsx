import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../app/store';
import { Preloader } from '../../components/ui';
import userOrdersDepot from '../../services/slices/userOrdersSlice';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export const ProfileOrders: FC = () => {
  const orders = useSelector(userOrdersDepot.selectOrdersValue);
  const isPending = useSelector(userOrdersDepot.selectIsPending);

  return isPending ? <Preloader /> : <ProfileOrdersUI orders={orders} />;
};
