import CartTable from "./cartTable.tsx";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import OrderForm from "./orderForm.tsx";
import {fetchLastItems} from "../../redux/cartSlice.ts";
import {useEffect} from "react";


export default function Cart() {
    const dispatch = useAppDispatch()
    const {firstSum,arrayId,lastItems} = useAppSelector(state => state.cart)

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        if(firstSum > 0){
            console.log("cart useEffect")
            dispatch(fetchLastItems(arrayId))
        }
    }, [firstSum])

    // {console.log("cart lastItems",lastItems)}
    // {console.log("cart firstSum",firstSum)}
    return (
        <>

            <section className="cart">
                <h2 className="text-center">Корзина</h2>
                <CartTable/>
            </section>
            {firstSum > 0 && <OrderForm/>}
        </>
    )
}