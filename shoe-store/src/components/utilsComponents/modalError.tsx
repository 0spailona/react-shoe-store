import {Modal} from "react-bootstrap";
import {useAppSelector} from "../../redux/hooks.ts";
import {topSalesError} from "../../redux/slices/topSalesListSlice.ts";
import {loadingCategoriesError, loadingListError} from "../../redux/slices/catalogListSlice.ts";
import {loadingProductError} from "../../redux/slices/productCardSlice.ts";
import {loadingCartErrors, updatingCartErrors} from "../../redux/slices/cart/cartSlice.ts";

export default function ModalError() {

    const topSalesLoadingError = useAppSelector(topSalesError)
    const listLoadingError = useAppSelector(loadingListError)
    const categoriesLoadingError = useAppSelector(loadingCategoriesError)
    const productLoadingError = useAppSelector(loadingProductError)
    const cartLoadingErrors = useAppSelector(loadingCartErrors)
    const cartUpdatingErrors = useAppSelector(updatingCartErrors)

    console.log("topSalesLoadingError", topSalesLoadingError)
    console.log("searchLoadingError", listLoadingError)
    console.log("categoriesLoadingError", categoriesLoadingError)
    console.log("productLoadingError", productLoadingError)
    console.log("productLoadingError", cartLoadingErrors)
    console.log("productLoadingError", cartUpdatingErrors)

    let title = ""
    let text = ""
    if(topSalesLoadingError ||
    listLoadingError || categoriesLoadingError || productLoadingError || cartLoadingErrors){
        title = "Loading error!"
        text =
    }

    else if(cartUpdatingErrors){
        title = "Attention!"
    }


    return (
        <Modal>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        </Modal>
    )
}