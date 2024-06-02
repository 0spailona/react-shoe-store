import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.ts";

const rootReducer = combineReducers({
    cart: cartReducer,
   // lastSearch: lastSearchReducer
});

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

