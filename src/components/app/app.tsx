import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <ConstructorPage /> }
]);

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <RouterProvider router={router} />
  </div>
);

export default App;
