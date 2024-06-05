import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {FullItem} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL


type Type = {
    size: string,
    id: number,
    price: number,
    title: string,
    count: number
}


export type Cart = {
    cartItems: { [id: string]: Type },
    arrayId: Array<number>,
    firstSum: number,
    lastSum: number,
    loading: boolean,
    loadingErrors: Array<string>,
    updatingErrors: Array<{id: string,message:string }>,
}

const initialState: Cart = {
    cartItems: {},
    arrayId: [],
    firstSum: 0,
    lastSum: 0,
    loading: true,
    loadingErrors: [],
    updatingErrors:[]
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

function getItemId(item: Type) {
    return `${item.id}-${item.size}`
}

function checkState(cartItems: { [id: string]: Type }, lastItems: Array<{
    sizes: Array<string>,
    id: number,
    price: number,
    title: string
}>) {
    const errors = []
    for (const key of Object.keys(cartItems)) {
        const cartItem = cartItems[key];
        const updateItem = lastItems.find(item => item.id === cartItem.id)
        if(!updateItem) {
            errors.push({id: key, message: "Product not found!"})
        }
        else{
            if (updateItem.price !== cartItem.price) {
                errors.push({id: key, message: "Change price"})
                cartItem.price = updateItem.price
            }
            if(!updateItem.sizes.includes(cartItem.size)){
                errors.push({id: key, message: "Size can't be less than 0"})
                cartItem.count = 0
            }
        }
    }

    return {errors, cartItems}
}


function toDoObj(obj: FullItem) {

    const availableSizes = []

    for (const size of obj.sizes) {
        if (size.available) {
            availableSizes.push(size.size)
        }
    }

    return {
        sizes: availableSizes,
        id: obj.id,
        price: obj.price,
        title: obj.title,
    }
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

function addToCart(cartItems: { [id: string]: Type },newItem: Type ) {
    cartItems[getItemId(newItem)] = newItem
    return cartItems
}

export const cartSlice = createSliceWithThunk({
    name: "cart",
    initialState,
    reducers: (create) => ({

        updateCart: create.asyncThunk<{ updateData: Array<FullItem>, newItem?: FullItem }, {
            cart: Array<number>,
            id: number, add: { isAdd: true, selectedSize: string, addCount: number },
            isRemove: boolean
        }>(async (pattern, {rejectWithValue}) => {
                try {
                    if (pattern.cart.length === 0 && pattern.add) {
                        return {updateData: [], newItem: await getOneProductData(pattern.id)}
                    }
                    if (pattern.add && pattern.cart.length > 0) {
                        return {
                            updateData: await Promise.all(pattern.cart.map(getOneProductData)),
                            newItem: await getOneProductData(pattern.id)
                        }
                    } else return {updateData: []}
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
                    console.log("fulfilled action.payload", action.payload)
                    const newItem = toDoNewItem(action.payload.newItem, action.meta.arg.add.selectedSize, action.meta.arg.add.addCount)
                    if (action.payload.updateData.length === 0 && newItem) {
                        //state.cartItems[getItemId(newItem)] = newItem
                        state.cartItems = addToCart(state.cartItems,newItem)
                    } else if (action.payload.updateData.length !== 0 && newItem) {
                        const newState = action.payload.updateData.map(toDoObj)
                        //console.log("fulfilled newState", newState)
                        //console.log("fulfilled state.cartItems", state.cartItems)
                        const updateResult = checkState(state.cartItems, newState)
                        state.cartItems = addToCart(updateResult.cartItems,newItem)
                        state.updatingErrors = updateResult.errors
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

export const { removeFromCart, fetchLastItems, updateCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer

/*addToCart: create.reducer((state, action: PayloadAction<CartFirstItem>) => {

            const newCartItem = state.firstItems.find(item => item.id === action.payload.id)
            if (!newCartItem) {
                state.firstItems.push(action.payload)
                state.arrayId.push(action.payload.id)
            } else {
                newCartItem.count++

            }
            state.firstSum += action.payload.price * action.payload.count
        }),
        removeFromCart: create.reducer((state, action: PayloadAction<number>) => {
            state.firstItems = state.firstItems.filter(x => x.id !== action.payload)
        }),*/


/*for (const item of state.firstItems) {
    const lastItem = action.payload.find(x => x.id === item.id)
    if (lastItem) {
        if (lastItem.price !== item.price) {
            state.error.push("Цена товара изменилась")
        }

        const size = lastItem.sizes.find(x => x.size === item.size)
        if (!size || !size.available) {

            //state.error.push("Количество товаров в корзине стало меньше")
        }
        if (lastItem.sizes) {

        //const count = item.count + lastItem.count
        state.lastItems.push({
            size: item.size,
            count: item.count,
            id: lastItem.id,
            price: lastItem.price,
            title: lastItem.title
        })

        state.lastSum += lastItem.price * item.count
    }

}*/
//console.log("fetchLastItems action payload", action.payload)
//console.log("fetchLastItems lastItems", state.lastItems)

/*fetchLastItems: create.asyncThunk<Array<FullItem>, Array<number>>(
            async (pattern, {rejectWithValue}) => {
                try {
                    console.log("fetchLastItems pattern", pattern)
                   return await Promise.all(pattern.map(getOneProductData))
                } catch (e) {
                    return rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = [];
                    state.lastItems = []
                },
                fulfilled: (state, action) => {
                    for (const item of state.firstItems) {
                        const lastItem = action.payload.find(x => x.id === item.id)
                        if (lastItem) {
                            if (lastItem.price !== item.price) {
                                state.error.push("Цена товара изменилась")
                            }

                            const size = lastItem.sizes.find(x => x.size === item.size)
                            if(!size || !size.available){

                                //state.error.push("Количество товаров в корзине стало меньше")
                            }
                           /* if (lastItem.sizes) {*/

//const count = item.count + lastItem.count
/* state.lastItems.push({
     size: item.size,
     count:item.count,
     id: lastItem.id,
     price: lastItem.price,
     title: lastItem.title
 })

 state.lastSum += lastItem.price * item.count
}

}
console.log("fetchLastItems action payload", action.payload)
console.log("fetchLastItems lastItems", state.lastItems)
},
rejected: (state, action) => {
state.error.push(action.payload as string)
},
settled: (state) => {
state.loading = false
}
}
),*/