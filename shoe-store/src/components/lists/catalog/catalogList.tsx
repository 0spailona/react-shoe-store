import List from "../list.tsx";
import {useAppSelector} from "../../../redux/hooks.ts";
import {catalogList} from "../../../redux/catalogListSlice.ts";

export default function CatalogList() {

    return (
        <List items={useAppSelector(catalogList)}/>
    )
}