import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../app/store';
import feedDepot, { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const isPending = useSelector(feedDepot.selectIsPending);
  const orders = useSelector(feedDepot.selectOrders) || [];

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  return isPending ? (
    <Preloader />
  ) : (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
