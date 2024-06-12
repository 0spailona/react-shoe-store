import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {countLoadItems, Item} from "../config.ts";

const basedUrl = import.meta.env.VITE_URL

export type CatalogListStore = {
    loading: boolean,
    hasMore: boolean,
    categories: Array<{ id: number, title: string }>,
    activeCategory: number,
    catalogList: Array<Item>,
    searchStr: string,
    error: string
}

const initialState: CatalogListStore = {
    loading: true,
    hasMore: false,
    categories: [],
    activeCategory: 0,
    catalogList: [],
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
        searchError: (state => state.error),
    },
    reducers: (create) => ({
        cleanStore: create.reducer((state) => {
            state.loading = true
            state.hasMore = false
            state.catalogList = []
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
                    //state.searchResultList = []
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        ),
        toSearchStr: create.reducer((state, action: PayloadAction<string>) => {
            state.loading = true
            state.searchStr = action.payload
        }),
        toActiveCategory: create.reducer((state, action: PayloadAction<number>) => {
            state.loading = true
            state.activeCategory = action.payload
        }),

        fetchCatalogList: create.asyncThunk<Array<Item>>(
            async (_, api) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const catalogStore = api.getState().catalogList
                    //console.log("fetchCatalogList 2 from middleware catalogStore", catalogStore)
                    const activeCategory = catalogStore.activeCategory
                    const searchStr = catalogStore.searchStr
                    const size = catalogStore.catalogList.length
                    let fullUrl = `${basedUrl}/api/items?`;

                    if (searchStr) {
                        fullUrl += `q=${searchStr}&`;
                    }

                    if (activeCategory) {
                        fullUrl += `categoryId=${activeCategory}&`
                    }

                    fullUrl += `offset=${size}&`

                    const response = await fetch(fullUrl)

                    if (Math.trunc(response.status / 100) !== 2) {
                        return api.rejectWithValue("Loading error!")
                    }
                    return await response.json()
                } catch (e) {
                    return api.rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.error = "";
                },
                fulfilled: (state, action) => {
                    //state.listLength = state.catalogList.length + action.payload.length
                    state.catalogList = [...state.catalogList, ...action.payload]
                    state.hasMore = action.payload.length >= countLoadItems
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


export const {cleanStore,fetchCatalogList, toActiveCategory, toSearchStr, fetchCategories} = catalogListSlice.actions
export const {catalogList, searchError} = catalogListSlice.selectors

const catalogListReducer = catalogListSlice.reducer
export default catalogListReducer