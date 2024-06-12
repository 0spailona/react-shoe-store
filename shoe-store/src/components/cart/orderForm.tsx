import {Button, Card, Form} from "react-bootstrap";
import * as React from "react";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {saveOwner} from "../../redux/orderFormSlice.ts";
import Preloader from "../utilsComponents/preloader.tsx";

export default function OrderForm() {
    const dispatch = useAppDispatch()

    const [inputValuePhone, setInputValuePhone] = useState("")
    const [inputValueAddress, setInputValueAddress] = useState("")
    const loading = useAppSelector(state => state.orderForm.loading)

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const phoneNumberData = Object.fromEntries(formData).phone.toString()
        console.log("phoneNumberData", phoneNumberData)
        const addressData = Object.fromEntries(formData).address.toString()
        console.log("address", addressData)
        dispatch(saveOwner({phone: phoneNumberData, address: addressData}))
    }


    return (
        <section className="order">
            {loading? <Preloader/> : <><h2 className="text-center">Оформить заказ</h2>
                <Card style={{maxWidth: "30rem", margin: "0 auto"}}>
                    <Form onSubmit={(e) => onFormSubmit(e)}>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="phone">Телефон</Form.Label>
                                <Form.Control id="phone" name="phone" placeholder="Ваш телефон"
                                    //pattern={""}
                                              onChange={(e) => setInputValuePhone(e.target.value)}
                                              value={inputValuePhone}
                                              required/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="address">Адрес доставки</Form.Label>
                                <Form.Control id="address" name="address" placeholder="Адрес доставки"
                                              onChange={(e) => setInputValueAddress(e.target.value)}
                                              value={inputValueAddress}
                                              required/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" id="agreement" label="Согласен с правилами
                                доставки" required/>
                            </Form.Group>
                            <Button variant="outline-secondary" type="submit">Оформить</Button></Card.Body>
                    </Form>
                </Card></>}

        </section>
    )

}