import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {FullItem} from "../config.ts";
import {checkState, getItemId, getManyProductData, toDoObj} from "./cartUtils.ts";

export type CartItem = {
    size: string,
    id: number,
    price: number,
    title: string,
    count: number
}


export type Cart = {
    cartItems: { [id: string]: CartItem },
    sum: number,
    loading: boolean,
    loadingErrors: Array<string>,
    updatingErrors: Array<{ id: string, message: string }>,
}

const initialState: Cart = {
    cartItems: {},
    sum: 0,
    loading: true,
    loadingErrors: [],
    updatingErrors: []
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})



export const cartSlice = createSliceWithThunk({
    name: "cart",
    initialState,
    reducers: (create) => ({
        removeFromCart: create.reducer((state, action: PayloadAction<string>) => {
            state.loading = true
            state.cartItems = Object.fromEntries(Object.entries(state.cartItems).filter(kv => kv[0] !== action.payload));
        }),
        addToCart: create.reducer((state, action: PayloadAction<CartItem>) => {
            state.loading = true
            state.cartItems[getItemId(action.payload)] = action.payload
            //console.log("state.cartItems[getItemId(action.payload)]",state.cartItems[getItemId(action.payload)])
        }),

        checkCart: create.asyncThunk<Array<FullItem>, Cart>(async (state, api) => {
                try {
                    //console.log("async prepare")
                    const arrayId = Object.keys(state.cartItems).map(key => state.cartItems[key].id)
                    console.log("checkCart arrayId",arrayId)
                    return await getManyProductData(arrayId)

                } catch (e) {
                    return api.rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.loadingErrors = [];
                },
                fulfilled: (state, action) => {
                    console.log("fulfilled action.payload", action.payload)
                    const newState = action.payload.map(toDoObj)[0]
                    console.log("fulfilled newState",newState)
                    const updateResult = checkState(state.cartItems, newState)
                    state.cartItems = updateResult.cartItems
                    state.updatingErrors = updateResult.errors
                    state.sum = updateResult.sum
                },
                rejected: (state, action) => {
                    state.loadingErrors.push(action.payload as string)
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        ),
    }),
})

export const {removeFromCart, checkCart, addToCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer

