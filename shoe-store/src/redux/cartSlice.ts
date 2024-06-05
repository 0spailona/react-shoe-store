import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {FullItem} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL

type Type = {
    [id:number]: {
        size: string,
        id: number,
        price: number,
        title: string
    }
}

export type Cart = {
    firstItems: Array<Type>,
    lastItems: Array<Type>,
    arrayId: Array<number>,
    firstSum: number,
    lastSum: number,
    loading: boolean,
    error: Array<string>,
}

const initialState: Cart = {
    firstItems: [],
    lastItems: [],
    arrayId: [],
    firstSum: 0,
    lastSum: 0,
    loading: true,
    error: [],
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

/*function getItemsFromServer( ids) {
    //...
}

async function updateAndCheckCart(state) {
    const ids = state.firstItems.map(x => x.id);
    const newItems = getItemsFromServer(ids);

    // check here

    return newState;
}*/

function checkState(firstItems: Array<Type>, lastItems: Array<{
    [id:number]: {
        sizes: Array<string>,
        id: number,
        price: number,
        title: string
    }
}>) {
    console.log("checkState lastItems", lastItems)
    console.log("checkState firstItems", firstItems)
    for (const item of firstItems) {
        console.log("checkState for item", item)
    }


    return {error: [], lastItems}
}

function toDoObj(obj: FullItem) {

    const availableSizes = []

    for (const size of obj.sizes) {
        if (size.available) {
            availableSizes.push(size.size)
        }
    }

    const id = obj.id
    return {
        [id]: {
            sizes: availableSizes,
            id: obj.id,
            price: obj.price,
            title: obj.title,
        }
    }
}

export const cartSlice = createSliceWithThunk({
    name: "cart",
    initialState,
    reducers: (create) => ({
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
        updateCart: create.asyncThunk<Array<FullItem>, {
            cart: Array<number>,
            id: number,add:{isAdd:true,selectedSize:string, addCount: number},
            isRemove: boolean
        }>(async (pattern, {rejectWithValue}) => {
                try {
                    //console.log("fetchLastItems pattern", pattern)
                    if (pattern.addCount === 0) {
                        return await Promise.all(pattern.cart.map(getOneProductData))
                    }
                    if (pattern.cart.length === 0 && pattern.addCount > 0) {
                        return [await getOneProductData(pattern.id)]
                    }
                    if (pattern.addCount > 0 && pattern.cart.length > 0) {
                        return [...await Promise.all(pattern.cart.map(getOneProductData)), ...await getOneProductData(pattern.id)]
                    } else return []
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
                    console.log("fulfilled action.payload",action.payload)
                    const newState = action.payload.map(toDoObj)
                    console.log("fulfilled newState",newState)
                    checkState(state.firstItems, newState)
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
                },
                rejected: (state, action) => {
                    state.error.push(action.payload as string)
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        ),
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
    })
})

export const {addToCart, removeFromCart, fetchLastItems, updateCart} = cartSlice.actions
const cartReducer = cartSlice.reducer
export default cartReducer