import {FullItem} from "../config.ts";
import {CartItem} from "./cartSlice.ts";

const basedUrl = import.meta.env.VITE_URL

export async function getOneProductData(id: number) {
    const fullUrl = `${basedUrl}/api/items/${id}`;
    const response = await fetch(fullUrl)

    if (!response.ok) {
        throw new Error("Loading error!")
    }
    return await response.json();
}

// should be done by one request with id list but we can't change the server
export function getManyProductData(ids: number[]) {
    return Promise.all(ids.map(getOneProductData))
}

export  function getItemId(item: CartItem) {
    console.log("getItemId item", item)
    const id = `${item.id}-${item.size}`
    // console.log("Get id", item, id);
    return id;
}

export function checkState(cartItems: { [id: string]: CartItem }, lastItems: {
    [id: string]: {
        price: number,
    }
}) {
    const errors = []
    const updateCartItems = {...cartItems};

     //console.log("checkState cartItems", updateCartItems)
    //console.log("checkState lastItems", lastItems)
    for (const key of Object.keys(updateCartItems)) {
        //console.log("checkState key", key)

        const cartItem = cartItems[key];
        const lastItem = lastItems[key];

        if (!lastItem) {
            errors.push({id: key, message: "Product not found!"})
            cartItem.count = 0
            continue;
        }

        if (cartItem.price !== lastItem.price) {
            errors.push({id: key, message: "Change price"})
            cartItem.price = lastItems[key].price
        }
    }

    const sum = Object.values(updateCartItems).reduce((sum, item) => sum + item.price * item.count, 0);

    return {errors, cartItems: updateCartItems, sum}
}

export function getUpdateDate(arr:Array<FullItem>){
    if(arr.length === 0) return {}

    const newArr = arr.map(toDoObj)
    const result: {
        [id: string]: {
            price: number,
        }
    } = {}
    for(const item of newArr){
        const key = Object.keys(item)[0]
        result[key] = item[key]
    }
        return result
}

function toDoObj(obj: FullItem) {
    const availableSizes = []

    for (const size of obj.sizes) {
        if (size.available) {
            availableSizes.push(size.size)
        }
    }

    const ids = availableSizes.map(x => `${obj.id}-${x}`)
    const result: {
        [id: string]: {
            price: number,
        }
    } = {}
    for (const id of ids) {
        result[id] = {
            price: obj.price,
        }
    }
    return result
}
