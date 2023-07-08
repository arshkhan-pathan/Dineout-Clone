// packages
import { combineReducers } from '@reduxjs/toolkit';
// slices
import authReducer from './slices/auth';
// api
import baseApi from './api/base';
// Location
import locationReducer from "./slices/restaurantSlice"


const rootReducer = combineReducers({
    'auth': authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    location: locationReducer,
    // add other reducers here
});

export default rootReducer;