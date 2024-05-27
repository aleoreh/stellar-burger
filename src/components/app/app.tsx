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

        <Route
          path='/login'
          element={
            <ProtectedRoute allowOnly='unauthorized'>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute allowOnly='unauthorized'>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute allowOnly='unauthorized'>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute allowOnly='unauthorized'>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route path='/feed' element={<Feed />} />
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
