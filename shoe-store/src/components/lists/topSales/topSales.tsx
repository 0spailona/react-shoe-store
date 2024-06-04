import Preloader from "../../utilsComponents/preloader.tsx";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks.ts";
import TopSalesList from "./topSalesList.tsx";
import {fetchTopSalesList} from "../../../redux/topSalesListSlice.ts";
import {useEffect} from "react";

export default function TopSales() {
    const {loading, hasItems} = useAppSelector(state => state.topsSalesList);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTopSalesList("/api/top-sales"))
    }, [dispatch])


    return (<>
            {!loading && !hasItems ? null :
                <>
                <section className="small-block">
                    <h2 className="text-center">Хиты продаж!</h2>
                    {loading ? <Preloader/> :
                        <TopSalesList/>}
                </section>
                </>
                }
        </>
    )
}