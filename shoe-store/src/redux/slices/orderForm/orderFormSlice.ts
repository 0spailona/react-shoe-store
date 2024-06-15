import {asyncThunkCreator, buildCreateSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchDataToServer, getItemsData} from "./orderFormUtils.ts";


export type OrderFormData = {
    owner: {
        phone: string,
        address: string,
    },
    loading: boolean,
    errors: string,
    success:boolean
}

const initialState: OrderFormData = {
    owner: {
        phone: "",
        address: "",
    },
    loading: false,
    errors: "",
    success:false
}

const createSliceWithThunk = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator}
})


export const orderFormSlice = createSliceWithThunk({
    name: "orderForm",
    initialState,
    reducers: (create) => ({
        saveOwner: create.reducer((state, action: PayloadAction<{ phone: string, address: string }>) => {
            state.loading = true
            state.owner = action.payload
        }),


        sendData: create.asyncThunk<boolean>(async (_, api) => {
                try {
                    console.log("async prepare")
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const cartItems = api.getState().cart.cartItems
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const owner = api.getState().orderForm.owner
                    const items = getItemsData(cartItems)
                    console.log("sendData items",items)
                    //const answer =
                        await fetchDataToServer({owner,items})
                   // console.log("answer",answer)
                    return true

                } catch (e) {
                    return api.rejectWithValue(e)
                }
            },
            {
                pending: (state) => {
                    state.loading = true;
                    state.errors = ""
                    state.success = false
                },
                fulfilled: (state) => {
                    state.success = true
                },
                rejected: (state, action) => {
                    state.errors = action.payload as string
                },
                settled: (state) => {
                    state.loading = false
                }
            }
        ),
    }),
})


export const {saveOwner, sendData} = orderFormSlice.actions
const orderFormReducer = orderFormSlice.reducer
export default orderFormReducer
