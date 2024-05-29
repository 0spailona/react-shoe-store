import TopSales from "./topSales.tsx";
import Catalog from "./catalog.tsx";

export default function Main() {
    return (<>
            <TopSales/>
            <Catalog isPage={false}/>
        </>
    );
}