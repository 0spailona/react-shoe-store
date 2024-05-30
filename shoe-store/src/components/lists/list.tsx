import {Item} from "../../config.ts";
import ListItem from "./listItem.tsx";
import {Row} from "react-bootstrap";

type Props ={
    items:Array<Item>;
}

export default function List({items}: Props) {

    return (
        <Row className="row">
            {items.map((item: Item) => <ListItem key={item.id} item={item}/>)}
        </Row>
    )
}