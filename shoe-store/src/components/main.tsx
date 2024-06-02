import TopSales from "./lists/topSales.tsx";
import Catalog from "./lists/catalog/catalog.tsx";

export default function Main() {
    return (<>
            <TopSales/>
            <Catalog isHasSearchForm={false}/>
        </>
    );
}