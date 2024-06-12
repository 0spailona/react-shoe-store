import CartTable from "./cartTable.tsx";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import OrderForm from "./orderForm.tsx";
import {useEffect} from "react";
import {checkCart} from "../../redux/cartSlice.ts";


export default function Cart() {

    const dispatch = useAppDispatch()
    const {cartItems} = useAppSelector(state => state.cart)
    const sucsess = useAppSelector(state => state.orderForm.success)
    useEffect(() => {
        dispatch(checkCart())
    }, [])

    return (
        <>{sucsess ? <h2 className="text-center">Заказ успешно оформлен</h2> : <>
            <section className="cart">
                <h2 className="text-center">Корзина</h2>
                <CartTable/>
            </section>
            {Object.keys(cartItems).length > 0 && <OrderForm/>}</>}
        </>
    )
}