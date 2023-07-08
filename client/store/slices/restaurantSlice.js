import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState:  { name: '' },
  reducers: {
    setLocation: (state, action) =>   {
      return { ...state, name: action.payload.name };
    }
  },
});

export const { setLocation } = locationSlice.actions;
export const selectCurrentLocation=(state)=>state.location;
export default locationSlice.reducer;   