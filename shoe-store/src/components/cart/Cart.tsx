import CartTable from "./cartTable.tsx";
import {Button, Card, Form} from "react-bootstrap";
import {useAppSelector} from "../../redux/hooks.ts";


export default function Cart(){

    const {items,sum} = useAppSelector(state => state.cart)

    return (
        <>
            <section className="cart">
                <h2 className="text-center">Корзина</h2>
                <CartTable items={items} sum={sum}/>
            </section>
            <section className="order">
                <h2 className="text-center">Оформить заказ</h2>
                <Card style={{maxWidth: "30rem", margin:  "0 auto"}}>
                    <Form className="card-body">
                        <Form.Group className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input className="form-control" id="phone" placeholder="Ваш телефон"/>
                        </Form.Group>
                        <Form.Group className="form-group">
                            <label htmlFor="address">Адрес доставки</label>
                            <input className="form-control" id="address" placeholder="Адрес доставки"/>
                        </Form.Group>
                        <Form.Group className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="agreement"/>
                            <label className="form-check-label" htmlFor="agreement">Согласен с правилами
                                доставки</label>
                        </Form.Group>
                        <Button variant="outline-secondary" type="submit">Оформить</Button>
                    </Form>
                </Card>
            </section>
        </>
    )
}