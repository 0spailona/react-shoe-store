import {Alert} from "react-bootstrap";
import {useAppSelector} from "../../redux/hooks.ts";
import {orderFormError} from "../../redux/slices/orderForm/orderFormSlice.ts";
import {useEffect, useState} from "react";
import {loadingCartErrors, updatingCartErrors} from "../../redux/slices/cart/cartSlice.ts";

export default function ModalError() {

    const sendOrderFormError = useAppSelector(orderFormError)
    //console.log("ModalError sendOrderFormError", sendOrderFormError)
    //const topSalesLoadingError = useAppSelector(topSalesError)
    //const listLoadingError = useAppSelector(loadingListError)
    //const categoriesLoadingError = useAppSelector(loadingCategoriesError)
    //const productLoadingError = useAppSelector(loadingProductError)
    const cartLoadingErrors = useAppSelector(loadingCartErrors)
    const cartUpdatingErrors = useAppSelector(updatingCartErrors)

    //console.log("topSalesLoadingError", topSalesLoadingError)
    // console.log("searchLoadingError", listLoadingError)
    //console.log("categoriesLoadingError", categoriesLoadingError)
    // console.log("productLoadingError", productLoadingError)
    //console.log("cartLoadingErrors", cartLoadingErrors)

    //console.log("cartUpdatingErrors", cartUpdatingErrors)
    const hideAlert = () =>{
        setShow(false)
    }
    const [show, setShow] = useState(false)
    const [error, setError] = useState({variant: "", text: ""})
    useEffect(() => {
        if (sendOrderFormError !== "" && sendOrderFormError !== error.text) {
            setError({variant: "danger", text: sendOrderFormError})
        } else if (cartLoadingErrors !== "" && cartLoadingErrors !== error.text) {
            setError({variant: "danger", text: cartLoadingErrors})
        } else if (cartUpdatingErrors.length !== 0) {
            const text = cartUpdatingErrors.join("!")
            if (text !== error.text) {
                setError({variant: "warning", text})
            }
        }
        setShow(true)
        setTimeout(hideAlert,10000)
    }, [sendOrderFormError, cartUpdatingErrors, cartLoadingErrors])

    return (
        <>{error.text ?
            <Alert variant={error.variant}
                   show={show}
                   className="d-flex justify-content-between"><span>{error.text}</span>
            </Alert> : null}
        </>
    )
}