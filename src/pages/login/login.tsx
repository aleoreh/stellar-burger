import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import { Preloader } from '../../components/ui';
import authDepot, { loginUser } from '../../services/slices/authSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const isPending = useSelector(authDepot.selectIsPending);
  const error = useSelector(authDepot.selectError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return isPending ? (
    <Preloader />
  ) : (
    <LoginUI
      errorText={error || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
