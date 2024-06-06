import CartTable from "./cartTable.tsx";
import {useAppSelector} from "../../redux/hooks.ts";
import OrderForm from "./orderForm.tsx";


export default function Cart() {
    const {cartItems} = useAppSelector(state => state.cart)

    return (
        <>

            <section className="cart">
                <h2 className="text-center">Корзина</h2>
                <CartTable/>
            </section>
            {Object.keys(cartItems).length > 0 && <OrderForm/>}
        </>
    )
}