import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {Item} from "../config.ts";
import {countLoadItems} from "../config.ts";

const url = import.meta.env.VITE_URL

type ItemsList = {
    loading: boolean,
    hasMore: boolean,
    categories: Array<{ id: number, title: string }>,
    activeCategory: number,
    list: Array<Item>,
    searchResultList: Array<Item>,
    searchStr: string,
    error: string
}

const initialState: ItemsList = {
    loading: true,
    hasMore: false,
    categories: [],
    activeCategory: 0,
    list: [],
    searchResultList: [],
    searchStr: "",
    error: ""
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

export const itemsListSlice = createSliceWithThunk({
    name: "itemsList",
    initialState,
    selectors: {
        list: (state) => state.list,
        hasMore: (state) => state.hasMore,
        categories: (state) => state.categories,
        activeCategory: (state) => state.activeCategory,
        searchStr: (state => state.searchStr),
        loadingState: (state => state.loading),
        searchError: (state => state.error)
    },
    reducers: (create) => ({
        changeActiveCategory: create.reducer((state, action: PayloadAction<number>) => {
            state.activeCategory = action.payload
            state.list = []
        }),
        fetchList: create.asyncThunk<Array<Item>,{ categoryId: number, searchStr: string, offset: { isOffset:boolean,size:number } }>(
            async (pattern, {rejectWithValue}) => {
                try {

                    let fullUrl = `${url}/api/items?`;

                    if (pattern.searchStr) {
                        fullUrl += `q=${(pattern.searchStr)}&`;
                    }

                    if (pattern.categoryId) {
                        fullUrl += `categoryId=${(pattern.categoryId)}&`
                    }

                    if (pattern.offset.isOffset) {
                        fullUrl += `offset=${pattern.offset.size}&`
                    }

                    const response = await fetch(fullUrl)

                    if (Math.trunc(response.status / 100) === 2) {
                        return rejectWithValue("Loading error!")
                    }

                    return await response.json();
                } catch (e) {
                    return rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = "";
                    state.searchResultList = []
                },
                fulfilled: (state, action) => {
                    state.searchResultList = action.payload
                    state.searchStr = action.meta.arg.searchStr ? action.meta.arg.searchStr : ""
                    state.activeCategory = action.meta.arg.categoryId ? action.meta.arg.categoryId : 0
                    state.list = action.meta.arg.offset ? [...state.list, ...action.payload] : action.payload
                    state.hasMore = action.meta.arg.searchStr.length > countLoadItems
                    state.error = ""
                },
                rejected: (state, action) => {
                    state.error = action.payload as string
                    state.searchResultList = []
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        )
    }),
})


export const {changeActiveCategory, fetchList} = itemsListSlice.actions
export const {list, searchStr, loadingState, searchError} = itemsListSlice.selectors

const itemsListReducer = itemsListSlice.reducer
export default itemsListReducer