import TopSales from "./lists/topSales.tsx";
import Catalog from "./lists/catalog.tsx";

export default function Main() {
    return (<>
            <TopSales/>
            <Catalog isPage={false}/>
        </>
    );
}