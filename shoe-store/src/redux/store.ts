import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.ts";
import catalogListReducer from "./catalogListSlice.ts";
import topSalesListReducer from "./topSalesListSlice.ts";
import productCardReducer from "./productCardslice.ts";

const rootReducer = combineReducers({
    cart: cartReducer,
    catalogList: catalogListReducer,
    topsSalesList:topSalesListReducer,
    productCard: productCardReducer,
});

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

