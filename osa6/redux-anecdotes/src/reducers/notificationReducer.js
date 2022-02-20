import { createSlice } from "@reduxjs/toolkit"

const notificationReducer = createSlice({
  name: 'notification',
  initialState: 'test notification',
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    }
  }
})

export default notificationReducer.reducer
export const { setNotification } = notificationReducer.actions