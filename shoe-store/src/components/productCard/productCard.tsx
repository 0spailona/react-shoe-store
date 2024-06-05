import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CartFirstItem} from "../../config.ts";
import Preloader from "../utilsComponents/preloader.tsx";
import {Button, ButtonGroup, Col, Image, Row} from "react-bootstrap";
import ProductCardTable from "./productCardTable.tsx";
import ModalError from "../utilsComponents/modalError.tsx";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {addToCart, updateCart} from "../../redux/cartSlice.ts";
import {fetchProductCard} from "../../redux/productCardSlice.ts";


export default function ProductCard() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {item, error, loading} = useAppSelector(state => state.productCard)
    const [count, setCount] = useState(1);
    const {cartItems} = useAppSelector(state => state.cart)
    const [selectedSize, setSelectedSize] = useState({
        index: -1, size: ""
    });

    //const [isInStock, setIsInStock] = useState(false);

    const addItemToCart = (item: CartFirstItem) => {

        const arrayId = Object.keys(cartItems).map(key => cartItems[key].id)

        console.log("arrayId",arrayId)

            //dispatch(addToCart(item))
        dispatch(updateCart({cart:arrayId,id:item.id, add:{isAdd:true,selectedSize:item.size, addCount: item.count},
            isRemove: false}))
            //navigate(`/cart`)
    }


    const {id} = useParams()

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(fetchProductCard(id))

    }, [])

    const increaseCount = () => {
        if (selectedSize.size) {
            const newCount = count + 1;
            setCount(newCount)
        }
    }

    const decreaseCount = () => {
        if (count > 0) {
            const newCount = count - 1;
            setCount(newCount)
        }
    }

    const newSelectedSize = (index: number, size: string) => {
        if (selectedSize.index === index) {
            return
        }
        setSelectedSize({index, size})
        setCount(1)
    }

    const drawSizes = (index: number, data: { size: string, available: boolean, }) => {
       // console.log("drawSizes", index, data.size, data.available)
        if (data.available) {
            return (
                <span key={index}
                      className={`catalog-item-size ${selectedSize.index === index ? "selected" : ""}`}
                      onClick={() => newSelectedSize(index, data.size)}>{data.size}</span>
            )
        }
    }

    const isInStock = () =>{
        let count = 0
        for(const size of item.sizes) {
            count = size.available ? count+1 : count
        }
        //console.log("count",count)
        return count > 0
    }

    return (
        <>
            {loading ? <Preloader/> : !error ?<>
                {}
                <section className="catalog-item">
                    <h2 className="text-center">{item.title}</h2>
                    <Row>
                        <Col md={5}>
                            <Image src={item.images[0]}
                                   alt={`Здесь должно быть фото товара "${item.title}", но что-то пошло не так`} fluid/>
                        </Col>
                        <Col md={7}>
                            <ProductCardTable sku={item.sku} manufacturer={item.manufacturer} color={item.color}
                                              material={item.material} season={item.season} reason={item.reason}/>
                            {isInStock() ? <>
                                <div className="text-center">
                                    <p>Размеры в наличии: {item.sizes.map((data, index) =>
                                                drawSizes(index, data))} </p>
                                    <div className="mb-3">Количество: <ButtonGroup size="sm" className="pl-2">
                                        <Button variant="secondary" onClick={() => decreaseCount()}>-</Button>
                                        <Button variant="outline-primary">{count}</Button>
                                        <Button variant="secondary" onClick={() => increaseCount()}>+</Button>
                                    </ButtonGroup>
                                    </div>
                                </div>
                                <Button variant="danger" size="lg" className="btn-block" onClick={
                                    () => addItemToCart({
                                        id: item.id,
                                        count,
                                        size: selectedSize.size,
                                        price:item.price
                                    })

                                }>В корзину</Button></> :
                            <h4>Товара нет в наличии</h4>}
                        </Col>
                    </Row>
                </section> </> : <ModalError/>}
        </>
    )
}
