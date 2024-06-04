import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CartItem} from "../config.ts";

export type Cart = {
    items: Array<CartItem>,
}

const initialState: Cart = {
    items: [],
}


export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {

            const newCartItem = state.items.find(item => item.id === action.payload.id)
            if (!newCartItem) {
                state.items.push(action.payload)
            } else {
                newCartItem.count++
            }

        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(x => x.id !== action.payload)
        }
    }
})

export const {addToCart, removeFromCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer