import {Button, Card, Form} from "react-bootstrap";
import {Component} from "react";
import * as React from "react";

export default class OrderForm extends Component {

    state: {
        inputValuePhone: string,
        inputValueAddress: string,
    } = {
        inputValuePhone: "",
        inputValueAddress: "",
    }

    onFormSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()

    }

    render() {
        return (
            <section className="order">
                <h2 className="text-center">Оформить заказ</h2>
                <Card style={{maxWidth: "30rem", margin: "0 auto"}}>
                    <Form onSubmit={(e)=>this.onFormSubmit(e)}>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="phone">Телефон</Form.Label>
                                <Form.Control id="phone" placeholder="Ваш телефон"
                                              pattern={""}
                                              onChange={(e) => this.setState({inputValue: e.target.value})}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="address">Адрес доставки</Form.Label>
                                <Form.Control id="address" placeholder="Адрес доставки"
                                              onChange={(e) => this.setState({inputValue: e.target.value})}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" id="agreement" label="Согласен с правилами
                                доставки" required/>
                            </Form.Group>
                            <Button variant="outline-secondary">Оформить</Button></Card.Body>
                    </Form>
                </Card>
            </section>
        )
    }
}