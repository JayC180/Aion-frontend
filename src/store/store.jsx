import { configureStore } from '@reduxjs/toolkit';
import calendarSlice from './calendarSlice';
import authSlice from './authSlice';
import uiSlice from './uiSlice';


export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store;