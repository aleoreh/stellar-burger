import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import feedDepot, { getFeeds } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const feed = useSelector(feedDepot.selectFeed);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getFeeds());
  }, []);

  return feed.pending ? (
    <Preloader />
  ) : feed.error ? (
    <div>{feed.error}</div>
  ) : (
    <FeedUI
      orders={feed.orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
