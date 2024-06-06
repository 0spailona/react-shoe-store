import {Button, NavLink, Table} from "react-bootstrap";
import {updateCart} from "../../redux/cartSlice.ts";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import Preloader from "../utilsComponents/preloader.tsx";


export default function CartTable() {
    const dispatch = useAppDispatch()
    const {cartItems, sum, loading} = useAppSelector(state => state.cart)
    // console.log("cartTable lastItems: ", lastItems)
    const keysCartItems = Object.keys(cartItems)
    if (keysCartItems.length === 0) {
        return (
            <h4 className="great-block text-center text-secondary p-5">Ваша корзина пуста</h4>
        )
    }
    const removeItem = (id: number,size:string) => {
        const arrayId = Object.keys(cartItems).map(key => cartItems[key].id)
        dispatch(updateCart({
            cart: arrayId,
            id: id, add: {isAdd: false, selectedSize: "", addCount: 0},
            remove:{isRemove: true,selectedSize:size}
        }))
    }


    return (<>

            {loading ? <Preloader/> :
                <Table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Название</th>
                        <th scope="col">Размер</th>
                        <th scope="col">Кол-во</th>
                        <th scope="col">Стоимость</th>
                        <th scope="col">Итого</th>
                        <th scope="col">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {keysCartItems.map((key, index) =>
                        <tr key={key}>
                            <td scope="row">{index + 1}</td>
                            <td><NavLink className="text-secondary"
                                         href="/products/1.html">{cartItems[key].title}</NavLink></td>
                            <td>{cartItems[key].size}</td>
                            <td>{cartItems[key].count}</td>
                            <td>{cartItems[key].price} руб.</td>
                            <td>{cartItems[key].price * cartItems[key].count} руб.</td>
                            <td>
                                <Button variant="outline-danger" size="sm"
                                        onClick={() => removeItem(cartItems[key].id,cartItems[key].size)}>Удалить</Button>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td colSpan={5} className="text-right">Общая стоимость</td>
                        <td>{sum} руб.</td>
                    </tr>
                    </tbody>
                </Table>}
        </>
    )
}