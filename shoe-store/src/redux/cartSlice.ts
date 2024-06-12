import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {FullItem} from "../config.ts";
import {checkState, getItemId, getManyProductData, getUpdateDate} from "./cartUtils.ts";

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
            const id = getItemId(action.payload)
            const item: CartItem = state.cartItems[id]
            if (!item) {
                state.cartItems[id] = action.payload
            } else {
                state.cartItems[id].count += action.payload.count
            }
        }),
        cleanCart: create.reducer((state) => {
            state.loading = true
            state.cartItems = {}
            state.loading = false
        }),

        checkCart: create.asyncThunk<Array<FullItem>>(async (_, api) => {
                try {
                    //console.log("async prepare")
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const cart = api.getState().cart
                   // console.log("cart",cart)
                    const arrayId = Object.keys(cart.cartItems).map(key => cart.cartItems[key].id)
                    //console.log("checkCart arrayId", arrayId)
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
                    //console.log("fulfilled action.payload", action.payload)
                    const newState = getUpdateDate(action.payload)
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

export const {removeFromCart, checkCart, addToCart,cleanCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer

