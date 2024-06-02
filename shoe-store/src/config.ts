export const headerNav = []

export type Item = {
    id:number,
    category:number,
    title:string,
    price:number,
    images:Array<string>
}

export type FullItem = {
    category:number,
    color:string,
    heelSize:string,
    id:number,
    images:Array<string>,
    manufacturer:string,
    material:string,
    price:number,
    reason:string,
    season:string,
    sizes:Array<{ size:string, available: boolean }>,
    sku:string,
    title:string,
}

export type CartItem ={
    title:string,
    price:number,
    size:string,
    count:number,
    id:number
}

export const countLoadItems = 6