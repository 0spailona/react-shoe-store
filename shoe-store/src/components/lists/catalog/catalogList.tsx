import List from "../list.tsx";
import {useAppSelector} from "../../../redux/hooks.ts";

export default function CatalogList() {

    const {catalogList, searchStr, activeCategory} = useAppSelector(state => state.catalogList)

    return (
        <>
            {catalogList.length > 0 ?
                <List items={catalogList}/> : searchStr || activeCategory ?
                    <div className="small-block">
                        <h4 className="text-center text-secondary m-5">Упс! Поиск не дал результатов.</h4>
                    </div> :
                    null}
        </>
    )
}
