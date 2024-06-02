import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CartItem, FullItem} from "../../config.ts";
import Preloader from "../utilsComponents/preloader.tsx";
import {Button, ButtonGroup, Col, Image, Row} from "react-bootstrap";
import ProductCardTable from "./productCardTable.tsx";
import ModalError from "../utilsComponents/modalError.tsx";
import {useAppDispatch} from "../../redux/hooks.ts";
import {addToCart} from "../../redux/cartSlice.ts";


export default function ProductCard() {
    const url = import.meta.env.VITE_URL
    const [card, setCard] = useState<FullItem>({
        category:-1,
        color:"",
        heelSize:"",
        id:-1,
        images:[],
        manufacturer:"",
        material:"",
        price:-1,
        reason:"",
        season:"",
        sizes:[],
        sku:"",
        title:"",
    })

    const dispatch = useAppDispatch()
    const addItemToCart = (item:CartItem)=>dispatch(addToCart(item))

    const [error,setError]=useState(false)
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState(0);
    const [selectedSize, setSelectedSize] = useState({ index:- 1, size:""
});

    const {id} = useParams()

    useEffect(() => {
        fetch(`${url}/api/items/${id}`)
            .then(response =>  response.json())
            .then(json => {
                console.log("card", json)
                setCard(json)
                setLoading(false)
            })
            .catch(() => setError(true))
    }, [])

    const increaseCount = () => {
        const newCount = count + 1;
        setCount(newCount)
    }

    const decreaseCount = () => {
        const newCount = count - 1;
        setCount(newCount)
    }

    const newSelectedSize = (index:number,size:string) => {
        if(selectedSize.index === index){
            return
        }
        setSelectedSize({index, size})
        setCount(0)
    }

    return (
        <>
            {loading ? <Preloader/> : !error ?
                <section className="catalog-item">
                    <h2 className="text-center">{card.title}</h2>
                    <Row>
                        <Col md={5}>
                            <Image src={card.images[0]} alt={`Здесь должно быть фото товара "${card.title}", но что-то пошло не так`} fluid/>
                        </Col>
                        <Col md={7}>
                           <ProductCardTable sku={card.sku} manufacturer={card.manufacturer} color={card.color} material={card.material} season={card.season} reason={card.reason}/>
                            <div className="text-center">
                                <p>Размеры в наличии: {card.sizes.map((data, index) =>
                                    <span key={index}
                                          className={`catalog-item-size ${selectedSize.index === index ? "selected" : ""}`}
                                          onClick={()=>newSelectedSize(index,data.size)}>{data.size} US</span>)}</p>
                                <div className="mb-3">Количество: <ButtonGroup size="sm" className="pl-2">
                                    <Button variant="secondary" onClick={() => decreaseCount()}>-</Button>
                                    <Button variant="outline-primary">{count}</Button>
                                    <Button variant="secondary" onClick={( )=> increaseCount()}>+</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <Button variant="danger" size="lg" className="btn-block" onClick={
                                ()=>addItemToCart({
                                    id:1,
                                    title:"A",
                                    count,
                                    size:selectedSize.size,
                                    price:card.price
                                })
                            }>В корзину</Button>
                        </Col>
                    </Row>
                </section> : <ModalError/>}
        </>
    )
}