import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../app/store';
import authDepot, { loginUser } from '../../services/slices/authSlice';
import { Preloader } from '../../components/ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const selectAuth = useSelector(authDepot.selectAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (selectAuth.isCheckingAuth) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={selectAuth.error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
