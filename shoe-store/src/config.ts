import {Cart} from "./redux/cartSlice.ts";
import {CatalogListStore} from "./redux/catalogListSlice.ts";
import {TopSalesListStore} from "./redux/topSalesListSlice.ts";

export const headerNav = [{pageName: "Главная", href: "/"},
    {pageName: "Каталог", href: "/catalog"},
    {pageName: "О магазине", href: "/about"},
    {pageName: "Контакты", href: "/contacts"}];

export type Item = {
    id: number,
    category: number,
    title: string,
    price: number,
    images: Array<string>
}

export type FullItem = {
    category: number,
    color: string,
    heelSize: string,
    id: number,
    images: Array<string>,
    manufacturer: string,
    material: string,
    price: number,
    reason: string,
    season: string,
    sizes: Array<{ size: string, available: boolean }>,
    sku: string,
    title: string,
}

export const initialStateProductCard = {
    category: -1,
    color: "",
    heelSize: "",
    id: -1,
    images: [],
    manufacturer: "",
    material: "",
    price: 0,
    reason: "",
    season: "",
    sizes: [],
    sku: "",
    title: "",
}

export type CartFirstItem = {
    size: string,
    count: number,
    id: number,
    price:number
}

export type CartLastItem = {
    size: string,
    count: number,
    id: number,
    price:number,
    title: string,
}

export const countLoadItems = 6

export type GlobalState ={
    cart: Cart,
    catalogList: CatalogListStore,
    topsSalesList:TopSalesListStore
}