import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { useSelector } from '../../app/store';
import authDepot from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(authDepot.selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
