import { configureStore } from '@reduxjs/toolkit';
import notification from './reducers/notification';

const store = configureStore({
  reducer: {
    notification,
  },
});

export default store;
