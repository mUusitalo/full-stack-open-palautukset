import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  timeoutID: null,
  success: true,
};

const reducer = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      return { ...state, ...action.payload };
    },
    setTimeoutID: (state, action) => {
      state.timeoutID = action.payload;
    },
    clearNotification: () => initialState,
  },
});

const { clearNotification, setTimeoutID } = reducer.actions;

const setNotification = (message, success = true, seconds) => {
  return async (dispatch, getState) => {
    const { timeoutID } = getState();

    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    const newID = setTimeout(
      () => dispatch(clearNotification()),
      seconds * 1000
    );

    dispatch(reducer.actions.setNotification({ message, success }));
    dispatch(setTimeoutID(newID));
  };
};

export default reducer.reducer;
export { setNotification };
