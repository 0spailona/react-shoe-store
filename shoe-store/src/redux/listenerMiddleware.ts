import {addToCart,removeFromCart, checkCart} from "./cartSlice.ts"
import {toActiveCategory,fetchCatalogList,toSearchStr,cleanStore} from "./catalogListSlice.ts"
import {sendData,saveOwner} from "./orderFormSlice.ts";

import {createListenerMiddleware, addListener, isAnyOf, Action} from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from './store'

export const listenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const startAppListening =
    listenerMiddleware.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<
    RootState,
    AppDispatch
>


startAppListening({
    matcher: isAnyOf(removeFromCart,addToCart),
    effect: (_action:Action, listenerApi) => {
        listenerApi.dispatch(checkCart())
    }
})

startAppListening({
    matcher: isAnyOf(toActiveCategory,toSearchStr),
    effect: (_action:Action, listenerApi) => {
        listenerApi.dispatch(cleanStore())
        listenerApi.dispatch(fetchCatalogList())
    }
})

startAppListening({
    matcher: isAnyOf(saveOwner),
    effect: (_action:Action, listenerApi) => {
        listenerApi.dispatch(checkCart())
        listenerApi.dispatch(sendData())
    }
})