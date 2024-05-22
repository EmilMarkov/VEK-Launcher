import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootReducer from '@store/reducers';
import rootSaga from '@store/sagas';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware, loggerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;