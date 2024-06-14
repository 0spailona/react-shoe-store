import TopSales from "./lists/topSales/topSales.tsx";
//import Catalog from "./lists/catalog/catalog.tsx";
import CatalogFunc from "./lists/catalog/catalogFunc.tsx";

export default function Main() {
    return (<>
            <TopSales/>
            <CatalogFunc isHasSearchForm={false}/>
        </>
    );
}
//