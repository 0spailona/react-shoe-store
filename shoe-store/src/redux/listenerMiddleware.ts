import {addToCart,removeFromCart, checkCart} from "./cartSlice.ts"

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
        //console.log("startAppListening removeFromCart")
        const {cart} = listenerApi.getState()
        console.log("startAppListening state", cart)
        listenerApi.dispatch(checkCart(cart))
    }
})