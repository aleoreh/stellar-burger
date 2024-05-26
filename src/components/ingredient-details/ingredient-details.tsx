import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { redirect, useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const _id = useParams<{ _id: string }>();
  if (!_id) {
    redirect('/');
    return null;
  }

  /** TODO: взять переменную из стора */
  const ingredientData = null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
