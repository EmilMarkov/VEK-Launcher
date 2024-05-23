import { combineReducers } from '@reduxjs/toolkit';
import fileReducer from '@/store/reducers/filesReducer';
import torrentsReducer from './torrentsReducer';
import gamesReducer from './gamesReducer';

const rootReducer = combineReducers({
  file: fileReducer,
  torrents: torrentsReducer,
  games: gamesReducer
});

export default rootReducer;