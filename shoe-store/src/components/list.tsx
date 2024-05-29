import {Item} from "../config.ts";
import ListItem from "./listItem.tsx";

type Props ={
    items:Array<Item>;
}

export default function List({items}: Props) {
    console.log("list items",items);

    return (
        <div className="row">
            {items.map((item: Item) => <ListItem key={item.id} item={item}/>)}
        </div>
    )
}