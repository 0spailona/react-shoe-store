/*import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {useState} from "react";
import {removeFromCart} from "../../redux/cartSlice.ts";
import Preloader from "../utilsComponents/preloader.tsx";
import {Button, NavLink, Table} from "react-bootstrap";

export default function CartTable() {
    const dispatch = useAppDispatch()
    const {lastItems, lastSum} = useAppSelector(state => state.cart)
    const [loading, setLoading] = useState<boolean>(true)


    const removeItem = (id: number) => dispatch(removeFromCart(id))
    if (lastItems.length === 0) {
        return (
            <h4 className="great-block text-center text-secondary p-5">Ваша корзина пуста</h4>
        )
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
                    {lastItems.map((item, index) =>
                        <tr key={index + 1}>
                            <td scope="row">{index + 1}</td>
                            <td><NavLink className="text-secondary" href="/products/1.html">{item.title}</NavLink></td>
                            <td>{item.size}</td>
                            <td>{item.count}</td>
                            <td>{item.price} руб.</td>
                            <td>{item.price * item.count} руб.</td>
                            <td>
                                <Button variant="outline-danger" size="sm" onClick={() => removeItem(item.id)}>Удалить</Button>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td colSpan={5} className="text-right">Общая стоимость</td>
                        <td>{lastSum} руб.</td>
                    </tr>
                    </tbody>
                </Table>}
        </>
    )
}*/