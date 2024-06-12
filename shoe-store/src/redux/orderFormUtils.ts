import {CartItem} from "./cartSlice.ts";

const basedUrl = import.meta.env.VITE_URL

type PostBody = {
    owner: {
        phone: string,
        address: string,
    },
    items:
        {
            id: number,
            price: number,
            count: number
        }[]
}

export function getItemsData(cartItems: { [id: string]: CartItem }) {
    return Object.values(cartItems).map(item => ({
            id: item.id,
            price: item.price,
            count: item.count
        })
    )
}

export async function fetchDataToServer(content: PostBody) {
    const fullUrl = `${basedUrl}/api/order`
    //const content = {owner,items}
    const response = await fetch(fullUrl, {method: "POST", body: JSON.stringify(content)})
    if (!response.ok) {
        throw new Error("Loading error!")
    }
    return await response.json();
}