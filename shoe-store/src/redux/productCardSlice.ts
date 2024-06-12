import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {FullItem, initialStateFullItem} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL

export type ProductCard = {
    item: FullItem,
    error:string,
    loading:boolean,
}

const initialState:ProductCard = {
    item: initialStateFullItem,
    error:"",
    loading:true
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

export const productCardSlice = createSliceWithThunk({
    name: "productCard",
    initialState,
    selectors: {
        item: (state) => state.item,
        loadingState: (state => state.loading),
        error: (state => state.error)
    },
    reducers: (create) => ({
        fetchProductCard: create.asyncThunk<FullItem,string>(
            async (pattern:string, {rejectWithValue}) => {
                try {
                    const fullUrl = `${basedUrl}/api/items/${pattern}`;
                    const response = await fetch(fullUrl)

                    //console.log("fetchTopSalesList response",response)

                    if (Math.trunc(response.status / 100) !== 2) {
                        return rejectWithValue("Loading error!")
                    }

                    const list = await response.json();
                   // console.log("fetchTopSalesList card", list)
                    return list
                    //return await response.json();
                } catch (e) {
                    return rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.item = initialState.item;
                    state.loading = true
                    state.error = ""
                },
                fulfilled: (state, action) => {
                    state.item = action.payload
                },
                rejected: (state, action) => {
                    state.error = action.payload as string
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        ),

    }),
})

export const {fetchProductCard} = productCardSlice.actions
export const {item, loadingState, error} = productCardSlice.selectors

const productCardReducer = productCardSlice.reducer
export default productCardReducer