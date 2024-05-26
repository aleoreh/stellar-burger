import { useDispatch } from '../../app/store';

import styles from './constructor-page.module.css';

import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BurgerConstructor, BurgerIngredients } from '../../components';
import { Preloader } from '../../components/ui';
import ingredientsDepot, {
  fetchIngredients
} from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  const isIngredientsLoading = useSelector(ingredientsDepot.selectIsLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
