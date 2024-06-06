import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {FullItem} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL


type CartItem = {
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


async function getOneProductData(id: number) {
    const fullUrl = `${basedUrl}/api/items/${id}`;
    const response = await fetch(fullUrl)

    if (!response.ok) {
        throw new Error("Loading error!")
    }
    return await response.json();
}

function getItemId(item: CartItem) {
    return `${item.id}-${item.size}`
}

function checkState(cartItems: { [id: string]: CartItem }, lastItems: {
    [id: string]: {
        price: number,
    }
}) {
    const errors = []
    let sum = 0

    if(Object.keys(cartItems).length === 0){
        return {errors:[], cartItems, sum}
    }
    for (const key of Object.keys(cartItems)) {
        if (!lastItems[key]) {
            errors.push({id: key, message: "Product not found!"})
            cartItems[key].count = 0
        } else {
            if (cartItems[key].price !== lastItems[key].price) {
                errors.push({id: key, message: "Change price"})
                cartItems[key].price = lastItems[key].price
                sum += cartItems[key].price * cartItems[key].count
            }
        }
    }

    return {errors, cartItems, sum}
}


function toDoObj(obj?: FullItem) {

    if(!obj) return {}
    const availableSizes = []

    for (const size of obj.sizes) {
        if (size.available) {
            availableSizes.push(size.size)
        }
    }

    const ids = availableSizes.map(x => `${obj.id}-${x}`)
    const result: {
        [id: string]: {
            price: number,
        }
    } = {}
    for (const id of ids) {
        result[id] = {
            price: obj.price,
        }
    }
    return result
}

function toDoNewItem(obj: FullItem | undefined, size: string, count: number) {
    return obj ? {
        size,
        id: obj.id,
        price: obj.price,
        title: obj.title,
        count
    } : null;
}

function addToCart(cartItems: { [id: string]: CartItem }, item: CartItem) {
    cartItems[getItemId(item)] = item
    return cartItems
}

function removeFromCart(cartItems: { [id: string]: CartItem }, item: CartItem){
    delete cartItems[getItemId(item)];
    return cartItems
}

export const cartSlice = createSliceWithThunk({
    name: "cart",
    initialState,
    reducers: (create) => ({

        updateCart: create.asyncThunk<{ updateData: Array<FullItem>, item?: FullItem}, {
            cart: Array<number>,
            id: number, add: { isAdd: boolean, selectedSize: string, addCount: number },
            remove: { isRemove: boolean, selectedSize: string }
        }>(async (pattern, {rejectWithValue}) => {
                try {
                    if (pattern.cart.length === 0 && pattern.add) {
                        return {updateData: [], item: await getOneProductData(pattern.id)}
                    }
                    if ((pattern.add && pattern.cart.length > 0) || (pattern.remove.isRemove)) {
                        return {
                            updateData: await Promise.all(pattern.cart.map(getOneProductData)),
                            item: await getOneProductData(pattern.id)
                        }
                    }
                  else return {updateData: []}
                } catch (e) {
                    return rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.loadingErrors = [];
                },
                fulfilled: (state, action) => {
                    //console.log("fulfilled action.payload", action.payload)
                    const item = toDoNewItem(action.payload.item, action.meta.arg.add.selectedSize, action.meta.arg.add.addCount)
                    const newState = action.payload.updateData.map(toDoObj)[0]
                    const updateResult = checkState(state.cartItems, newState)
                    state.updatingErrors = updateResult.errors

                    if(item){
                        if(action.meta.arg.add.isAdd){
                            state.cartItems = addToCart(updateResult.cartItems, item)
                            state.sum = updateResult.sum + item.price * item.count
                        }
                        if(action.meta.arg.remove.isRemove){
                            state.cartItems = removeFromCart(updateResult.cartItems,item)
                            state.sum = updateResult.sum - item.price * item.count
                            console.log("state.cartItems",Object.keys(state.cartItems).length)
                        }
                    }
                },
                rejected: (state, action) => {
                    state.loadingErrors.push(action.payload as string)
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        ),

    })
})

export const { updateCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer

