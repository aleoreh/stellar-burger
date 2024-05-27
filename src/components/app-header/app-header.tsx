import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../app/store';
import authDepot from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const auth = useSelector(authDepot.selectAuth);

  return <AppHeaderUI userName={auth.user?.name} />;
};
