import List from "../list.tsx";
import {useAppSelector} from "../../../redux/hooks.ts";
import {catalogList} from "../../../redux/slices/catalogListSlice.ts";

export default function CatalogList() {

    const list = useAppSelector(catalogList)
    return (
        <>
            {list.length > 0 ?
                <List items={list}/> :
                <div className="small-block"><h4 className="text-center text-secondary m-5">Упс! Поиск не дал результатов.</h4></div>}
        </>
    )
}
