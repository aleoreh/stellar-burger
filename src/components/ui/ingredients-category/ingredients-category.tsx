import { BurgerIngredient } from '@components';
import { forwardRef } from 'react';
import styles from './ingredients-category.module.css';
import { TIngredientsCategoryUIProps } from './type';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryUIProps
>(({ title, titleRef, ingredients, ingredientsCounters }, ref) => (
  <>
    <h3
      className='text text_type_main-medium mt-10 mb-6'
      ref={titleRef}
      data-cy='ingredients-category-title'
    >
      {title}
    </h3>
    <ul className={styles.items} ref={ref}>
      {ingredients.map((ingredient) => (
        <BurgerIngredient
          ingredient={ingredient}
          key={ingredient._id}
          count={ingredientsCounters[ingredient._id]}
        />
      ))}
    </ul>
  </>
));
