import { createSlice } from "@reduxjs/toolkit"

const filterReducer = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (state, action) => action.payload,
  },
})

export default filterReducer.reducer
export const { setFilter } = filterReducer.actions