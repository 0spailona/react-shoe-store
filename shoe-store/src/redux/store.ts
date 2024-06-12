import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice.ts";
import catalogListReducer from "./catalogListSlice.ts";
import topSalesListReducer from "./topSalesListSlice.ts";
import productCardReducer from "./productCardSlice.ts";
import {listenerMiddleware} from "./listenerMiddleware.ts";
import orderFormReducer from "./orderFormSlice.ts";


const rootReducer = combineReducers({
    cart: cartReducer,
    catalogList: catalogListReducer,
    topSalesList:topSalesListReducer,
    productCard: productCardReducer,
    orderForm:orderFormReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

