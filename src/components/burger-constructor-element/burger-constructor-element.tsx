import { BurgerConstructorElementUI } from '@ui';
import { FC, memo } from 'react';
import { useDispatch } from '../../app/store';
import orderDepot from '../../services/slices/orderSlice';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(orderDepot.moveDown(index));
    };

    const handleMoveUp = () => {
      dispatch(orderDepot.moveUp(index));
    };

    const handleClose = () => {
      dispatch(orderDepot.deleteIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
