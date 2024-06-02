import {Button, NavLink, Table} from "react-bootstrap";
import {CartItem} from "../../config.ts";
import {removeFromCart} from "../../redux/cartSlice.ts";
import {useAppDispatch} from "../../redux/hooks.ts";

type Props = {
    items:Array<CartItem>,
    sum:number,
}

export default function CartTable({items,sum}: Props) {
    const dispatch = useAppDispatch()
    const removeItem = (id:number)=>dispatch(removeFromCart(id))
    if(items.length === 0){return}
    return(
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
            {items.map((item,index)=>
                <tr key={index+1}>
                    <td scope="row">{index + 1}</td>
                    <td><NavLink className="text-secondary" href="/products/1.html">{item.title}</NavLink></td>
                    <td>{item.size}</td>
                    <td>{item.count}</td>
                    <td>{item.price} руб.</td>
                    <td>{item.price * item.count} руб.</td>
                    <td>
                        <Button variant="outline-danger" size="sm" onClick={()=>removeItem(item.id)}>Удалить</Button>
                    </td>
                </tr>
            )}

            <tr>
                <td colSpan={5} className="text-right">Общая стоимость</td>
                <td>{sum} руб.</td>
            </tr>
            </tbody>
        </Table>
    )
}