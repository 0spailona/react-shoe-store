import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CartItem} from "../config.ts";

export type Cart = {
    items: Array<CartItem>,
    sum: number
}

const initialState: Cart = {
    items: [],
    sum: 0
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
            state.sum += action.payload.price * action.payload.count

        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            const cartItem = state.items.find(item => item.id === action.payload)
            state.items = state.items.filter(x => x.id !== action.payload)
            if (cartItem) {
                state.sum -= cartItem.price* cartItem.count
            }
        }
    }
})

export const {addToCart, removeFromCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer