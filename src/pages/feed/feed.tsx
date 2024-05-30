import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import feedDepot, { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const feed = useSelector(feedDepot.selectFeed);
  const orders = useSelector(feedDepot.selectOrders);

  return feed.pending ? (
    <Preloader />
  ) : feed.error ? (
    <div>{feed.error}</div>
  ) : (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
