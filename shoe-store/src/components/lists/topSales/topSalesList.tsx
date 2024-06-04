import List from "../list.tsx";
import {useAppSelector} from "../../../redux/hooks.ts";

export default function TopSalesList() {

    const list = useAppSelector(state => state.topsSalesList.topSalesList)

    return (
        <List items={list}/>
    )
}