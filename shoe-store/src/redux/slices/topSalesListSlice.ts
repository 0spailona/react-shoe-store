import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {Item} from "../../config.ts";

const basedUrl = import.meta.env.VITE_URL

export type TopSalesListStore = {
    loading: boolean,
    topSalesListItems: Array<Item>,
    hasItems: boolean,
    error: string
}

const initialState: TopSalesListStore = {
    loading: true,
    topSalesListItems: [],
    hasItems: false,
    error: ""
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

export const topSalesListSlice = createSliceWithThunk({
    name: "topSalesList",
    initialState,
    selectors: {
        topSalesListItems: (state) => state.topSalesListItems,
        loadingState: (state => state.loading),
        topSalesError: (state => state.error)
    },
    reducers: (create) => ({
        fetchTopSalesList: create.asyncThunk<Array<Item>,string>(
            async (pattern:string, {rejectWithValue}) => {
                try {
                    const fullUrl = `${basedUrl}${pattern}`;
                    const response = await fetch(fullUrl)

                    if (Math.trunc(response.status / 100) !== 2) {
                        return rejectWithValue("Loading error!")
                    }

                    return await response.json()

                } catch (e) {
                    return rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = "";
                    state.topSalesListItems = []
                },
                fulfilled: (state, action) => {
                    state.topSalesListItems = action.payload
                    state.hasItems = action.payload.length !== 0
                    state.error = ""
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

export const {fetchTopSalesList} = topSalesListSlice.actions
export const {topSalesListItems, loadingState, topSalesError} = topSalesListSlice.selectors

const topSalesListReducer = topSalesListSlice.reducer
export default topSalesListReducer
