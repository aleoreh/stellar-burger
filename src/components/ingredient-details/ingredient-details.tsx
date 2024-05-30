import { FC } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { useSelector } from '../../app/store';
import ingredientsDepot from '../../services/slices/ingredientsSlice';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

export const IngredientDetails: FC = () => {
  const { _id } = useParams<{ _id: string }>();
  if (!_id) {
    redirect('/');
    return null;
  }

  const ingredients = useSelector(ingredientsDepot.selectIngredients) || [];

  const ingredientData = ingredients.find((x) => x._id === _id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
