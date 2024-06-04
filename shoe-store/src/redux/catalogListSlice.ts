import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {countLoadItems, Item} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL

export type CatalogListStore = {
    loading: boolean,
    hasMore: boolean,
    categories: Array<{ id: number, title: string }>,
    activeCategory: number,
    catalogList: Array<Item>,
    listLength: number,
    searchResultList: Array<Item>,
    searchStr: string,
    error: string
}

const initialState: CatalogListStore = {
    loading: true,
    hasMore: false,
    categories: [],
    activeCategory: 0,
    catalogList: [],
    listLength: 0,
    searchResultList: [],
    searchStr: "",
    error: ""
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})

export const catalogListSlice = createSliceWithThunk({
    name: "catalogList",
    initialState,
    selectors: {
        catalogList: (state) => state.catalogList,
        hasMore: (state) => state.hasMore,
        categories: (state) => state.categories,
        activeCategory: (state) => state.activeCategory,
        searchStr: (state => state.searchStr),
        loadingState: (state => state.loading),
        searchError: (state => state.error),
        listLength: (state => state.listLength),
    },
    reducers: (create) => ({
        changeActiveCategory: create.reducer((state, action: PayloadAction<number>) => {
            state.activeCategory = action.payload
            state.catalogList = []
            state.hasMore = false
            state.listLength = 0
        }),
        cleanStore: create.reducer((state) => {
            state.loading = true
            state.hasMore = false
            //state.activeCategory = 0
            state.catalogList = []
            //state.searchResultList = []
            //state.searchStr = ""
            state.error = ""
        }),

        fetchCategories: create.asyncThunk<Array<Item>, string>(
            async (pattern, {rejectWithValue}) => {
                try {
                    const fullUrl = `${basedUrl}${pattern}`;
                    const response = await fetch(fullUrl)

                    if (Math.trunc(response.status / 100) !== 2) {
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
                    state.categories = []
                },
                fulfilled: (state, action) => {
                    state.categories = action.payload
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
        ),
        fetchCatalogList: create.asyncThunk<Array<Item>, {
            categoryId: number,
            searchStr: string,
            offset: { isOffset: boolean, size: number }
        }>(
            async (pattern, {rejectWithValue}) => {
                try {

                    let fullUrl = `${basedUrl}/api/items?`;

                    if (pattern.searchStr) {
                        fullUrl += `q=${(pattern.searchStr)}&`;
                    }

                    if (pattern.categoryId) {
                        fullUrl += `categoryId=${(pattern.categoryId)}&`
                    }

                    if (pattern.offset.isOffset) {
                        //console.log("fetchCatalogList pattern.offset.size",pattern.offset.size)
                        fullUrl += `offset=${pattern.offset.size}&`
                    }

                    const response = await fetch(fullUrl)

                    if (Math.trunc(response.status / 100) !== 2) {
                        return rejectWithValue("Loading error!")
                    }
                    const list = await response.json();
                    console.log("fetchCatalogList list", list)
                    return list
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
                    state.listLength = state.catalogList.length + action.payload.length
                    //state.searchResultList = action.payload

                    /*if (action.meta.arg.categoryId !== state.activeCategory) {
                        console.log("new category")
                        state.catalogList = action.payload
                    }*/
                    if (action.meta.arg.offset.isOffset) {
                        console.log("offset")
                        state.catalogList = [...state.catalogList, ...action.payload]
                    }
                   /* if (action.meta.arg.searchStr) {
                        console.log("search")
                        state.catalogList = action.payload
                    }*/ else {
                        state.catalogList = action.payload
                    }
                    state.searchStr = action.meta.arg.searchStr ? action.meta.arg.searchStr : ""
                    state.activeCategory = action.meta.arg.categoryId ? action.meta.arg.categoryId : state.activeCategory
                    state.hasMore = action.payload.length >= countLoadItems
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


export const {changeActiveCategory, cleanStore, fetchCatalogList, fetchCategories} = catalogListSlice.actions
export const {catalogList, listLength, searchStr, loadingState, searchError} = catalogListSlice.selectors

const catalogListReducer = catalogListSlice.reducer
export default catalogListReducer