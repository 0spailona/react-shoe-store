import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.ts";
import itemsListReducer from "./getItemsListSlice.ts";

const rootReducer = combineReducers({
    cart: cartReducer,
    itemsList: itemsListReducer
});

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

