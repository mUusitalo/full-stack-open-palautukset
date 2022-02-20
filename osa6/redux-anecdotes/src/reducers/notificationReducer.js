import { createSlice } from "@reduxjs/toolkit"

const notificationReducer = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => null,
  }
})

export default notificationReducer.reducer
export const { setNotification, clearNotification } = notificationReducer.actions