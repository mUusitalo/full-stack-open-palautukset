import { createSlice } from "@reduxjs/toolkit"

const notificationReducer = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setPermanentNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => null,
  }
})

export default notificationReducer.reducer
export const { setPermanentNotification, clearNotification } = notificationReducer.actions

const setNotification = (content, seconds) => {
  return async dispatch => {
    setTimeout(() => dispatch(clearNotification()), seconds * 1000)
    dispatch(setPermanentNotification(content))
  }
}
export { setNotification }