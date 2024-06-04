import {asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {Item} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL

export type TopSalesListStore = {
    loading: boolean,
    topSalesList: Array<Item>,
    hasItems: boolean,
    error: string
}

const initialState: TopSalesListStore = {
    loading: true,
    topSalesList: [],
    hasItems: false,
    error: ""
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

export const topSalesListSlice = createSliceWithThunk({
    name: "catalogList",
    initialState,
    selectors: {
        topSalesList: (state) => state.topSalesList,
        loadingState: (state => state.loading),
        error: (state => state.error)
    },
    reducers: (create) => ({
        fetchTopSalesList: create.asyncThunk<Array<Item>,string>(
            async (pattern:string, {rejectWithValue}) => {
                try {
                    const fullUrl = `${basedUrl}${pattern}`;
                    const response = await fetch(fullUrl)

                    //console.log("fetchTopSalesList response",response)

                    if (Math.trunc(response.status / 100) !== 2) {
                        return rejectWithValue("Loading error!")
                    }

                    const list = await response.json();
                    //console.log("fetchTopSalesList list", list)
                    return list
                    //return await response.json();
                } catch (e) {
                    return rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = "";
                    state.topSalesList = []
                },
                fulfilled: (state, action) => {
                    state.topSalesList = action.payload
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
export const {topSalesList, loadingState, error} = topSalesListSlice.selectors

const topSalesListReducer = topSalesListSlice.reducer
export default topSalesListReducer