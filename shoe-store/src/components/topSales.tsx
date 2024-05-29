import Preloader from "./preloader.tsx";

export default function TopSales() {
    return (
        <div className="small-block">
            <h2 className="text-center">Хиты продаж!</h2>
           <Preloader/>
        </div>
    )
}