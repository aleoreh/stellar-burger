import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  allowOnlyAuthorized?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  allowOnlyAuthorized,
  children
}: ProtectedRouteProps) => {
  const isCheckingAuth = false;
  const isLoggedIn = false;
  const user = 'user';

  const location = useLocation();

  if (!isCheckingAuth) {
    return <div>Загрузка...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate replace to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
  }

  if (!allowOnlyAuthorized && !user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
