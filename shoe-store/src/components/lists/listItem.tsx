import {Item} from "../../config.ts";
import {Button, Card, Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

type Props = {
    item: Item
}

export default function ListItem({item}: Props) {
    const navigate = useNavigate()

    return (
        <Col md={4}>
            <div className="h-100  d-flex">
                <Card className="catalog-item-card w-100 overflow-hidden"
                      onClick={() => navigate(`/productCard/${item.id}`)}>
                    <div className="image-wrap d-flex justify-content-center flex-column">
                        <Image src={item.images[0]} alt={item.title} fluid className="mh-100"/>
                    </div>
                    <Card.Body className="d-flex flex-column align-items-start">
                        <Card.Text>{item.title}</Card.Text>
                        <div className="flex-fill"></div>
                        <Card.Text>{item.price} руб.</Card.Text>
                        <Button variant="outline-secondary" className="align-content-end">Заказать</Button>
                    </Card.Body>
                </Card>
            </div>
        </Col>
    )
}