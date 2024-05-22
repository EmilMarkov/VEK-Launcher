import { combineReducers } from '@reduxjs/toolkit';
import fileReducer from '@store/reducers/fileReducer';

const rootReducer = combineReducers({
  file: fileReducer,
});

export default rootReducer;