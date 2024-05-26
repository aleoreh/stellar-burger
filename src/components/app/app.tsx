import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import '../../index.css';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch } from '../../app/store';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import styles from './app.module.css';

const router = createBrowserRouter([
  { path: '/', element: <ConstructorPage /> },
  { path: '/feed', element: <Feed /> },
  {
    path: '/login',
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    )
  },
  {
    path: '/register',
    element: (
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <ProtectedRoute>
        <ForgotPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/reset-password',
    element: (
      <ProtectedRoute>
        <ResetPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile/orders',
    element: (
      <ProtectedRoute>
        <ProfileOrders />
      </ProtectedRoute>
    )
  },
  {
    path: '/feed/:number',
    element: (
      <Modal title='OrderInfo' onClose={() => {}}>
        <OrderInfo />
      </Modal>
    )
  },
  {
    path: '/ingredients/:id',
    element: (
      <Modal title='IngredientsDetails' onClose={() => {}}>
        <IngredientDetails />
      </Modal>
    )
  },
  {
    path: '/profile/orders/:number',
    element: (
      <Modal title='OrderInfo' onClose={() => {}}>
        <OrderInfo />
      </Modal>
    )
  },
  { path: '/*', element: <NotFound404 /> }
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
