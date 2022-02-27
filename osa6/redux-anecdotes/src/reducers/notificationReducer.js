import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  message: null,
  timeoutID: null,
}

const notificationReducer = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      return {...state, message: action.payload}
    },
    setTimeoutID: (state, action) => {
      return {...state, timeoutID: action.payload}
    },
    clearNotification: () => initialState,
  }
})

export default notificationReducer.reducer
export const { setMessage, clearNotification } = notificationReducer.actions

const setNotification = (content, seconds) => {
  return async (dispatch, getState) => {
    const { timeoutID } = getState().notification

    if (timeoutID) {clearTimeout(timeoutID)}
    const newID = setTimeout(() => dispatch(clearNotification()), seconds * 1000)
    
    dispatch(notificationReducer.actions.setTimeoutID(newID))
    dispatch(setMessage(content))
  }
}
export { setNotification }