type NotAsked = {
  type: 'notAsked';
};

type Waiting = {
  type: 'waiting';
};

type Rejected = {
  type: 'rejected';
  error: string;
};

type Fulfilled<T> = {
  type: 'fulfilled';
  value: T;
};

export type RemoteData<T> = NotAsked | Waiting | Rejected | Fulfilled<T>;

export const notAsked = <T>(): RemoteData<T> => ({ type: 'notAsked' });

export const isNotAsked = <T>(value: RemoteData<T>): value is NotAsked =>
  value.type === 'notAsked';

export const waiting = <T>(): RemoteData<T> => ({ type: 'waiting' });

export const isWaiting = <T>(value: RemoteData<T>): value is Waiting =>
  value.type === 'waiting';

export const rejected = <T>(error: string): RemoteData<T> => ({
  type: 'rejected',
  error
});

export const isRejected = <T>(value: RemoteData<T>): value is Waiting =>
  value.type === 'rejected';

export const fulfilled = <T>(value: T): Fulfilled<T> => ({
  type: 'fulfilled',
  value
});

export const isFulfilled = <T>(value: RemoteData<T>): value is Fulfilled<T> =>
  value.type === 'fulfilled';

export const remoteData = {
  notAsked,
  isNotAsked,
  waiting,
  isWaiting,
  rejected,
  isRejected,
  fulfilled,
  isFulfilled,
  getValue: <T>(x: Fulfilled<T>): T => x.value
};
