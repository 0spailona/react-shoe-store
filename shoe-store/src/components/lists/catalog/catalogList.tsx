import List from "../list.tsx";
import {useAppSelector} from "../../../redux/hooks.ts";

export default function CatalogList() {

    const list = useAppSelector(state => state.catalogList.catalogList)

    return (
        <List items={list}/>
    )
}