import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {FullItem} from "../config.ts";
import Preloader from "./preloader.tsx";
import {Button, ButtonGroup, Image, Table} from "react-bootstrap";
import ProductCardTable from "./productCardTable.tsx";


export default function ProductCard() {
    const url = import.meta.env.VITE_URL
    const [card, setCard] = useState<FullItem>({})
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState(0);
    const [selectedSize, setSelectedSize] = useState(-1);

    const {id} = useParams()

    useEffect(() => {
        fetch(`${url}/api/items/${id}`)
            .then(response => response.json())
            .then(json => {
                console.log("card", json)
                setCard(json)
                setLoading(false)
            })
    }, [])

    const increaseCount = () => {
        const newCount = count + 1;
        setCount(newCount)
    }

    const decreaseCount = () => {
        const newCount = count - 1;
        setCount(newCount)
    }

    const newSelectedSize = (index:number) => {
        if(selectedSize === index){
            return
        }
        setSelectedSize(index)
        setCount(0)
    }

    return (
        <>
            {loading && <Preloader/>}
            {!loading &&
                <section className="catalog-item">
                    <h2 className="text-center">{card.title}</h2>
                    <div className="row">
                        <div className="col-5">
                            <Image src={card.images[0]} alt={card.title} fluid/>
                        </div>
                        <div className="col-7">
                           <ProductCardTable sku={card.sku} manufacturer={card.manufacturer} color={card.color} material={card.material} season={card.season} reason={card.reason}/>
                            <div className="text-center">
                                <p>Размеры в наличии: {card.sizes.map((data, index) => <span key={index}
                                                                                             className={`catalog-item-size ${selectedSize === index ? "selected" : ""}`} onClick={()=>newSelectedSize(index)}>{data.size} US</span>)}</p>
                                <p>Количество: <ButtonGroup size="sm" className="pl-2">
                                    <Button variant="secondary" onClick={() => decreaseCount()}>-</Button>
                                    <Button variant="outline-primary">{count}</Button>
                                    <Button variant="secondary" onClick={( )=> increaseCount()}>+</Button>
                                    </ButtonGroup>
                                </p>
                            </div>
                            <Button variant="danger" size="lg" className="btn-block">В корзину</Button>
                        </div>
                    </div>
                </section>}
        </>
    )
}