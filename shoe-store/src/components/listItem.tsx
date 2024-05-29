import {Item} from "../config.ts";
import {Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

type Props = {
    item:Item
}

export default function ListItem({item}: Props) {
    const navigate = useNavigate()

    return (
            <div className="col-4">
                <Card className="catalog-item-card" onClick={()=>navigate(`/productCard/${item.id}`)}>
                    <Card.Img variant="top" src={item.images[0]}
                         className="card-img-top" alt={item.title}/>
                        <Card.Body className="card-body">
                            <Card.Text className="card-text">{item.title}</Card.Text>
                            <Card.Text className="card-text">{item.price} руб.</Card.Text>
                            <a href="#" className="btn btn-outline-primary">Заказать</a>
                        </Card.Body>
                </Card>
            </div>
)
}