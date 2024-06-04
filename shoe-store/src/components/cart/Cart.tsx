import CartTable from "./cartTable.tsx";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import OrderForm from "./orderForm.tsx";
import {fetchProductCard} from "../../redux/productCardslice.ts";


export default function Cart() {
    const dispatch = useAppDispatch()
    const {items} = useAppSelector(state => state.cart)

    const toSum = () =>{
        let sum = 0;
        for(const item of items){
            dispatch(fetchProductCard(`${item.id}`))
            const trueItemData = useAppSelector(state => state.productCard.item)
        }
        return true
    }

    return (
        <>
            <section className="cart">
                <h2 className="text-center">Корзина</h2>
                <CartTable/>
            </section>
            {toSum() && <OrderForm/>}
        </>
    )
}