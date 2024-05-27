import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import authDepot, { registerUser } from '../../services/slices/authSlice';
import { Preloader } from '../../components/ui';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const selectAuth = useSelector(authDepot.selectAuth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }));
  };

  if (selectAuth.isCheckingAuth) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={selectAuth.error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
