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
import {
  Route,
  Routes,
  createBrowserRouter,
  useLocation,
  useNavigate
} from 'react-router-dom';
import '../../index.css';
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
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const navigate = useNavigate();
  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:_id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
