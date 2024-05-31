import Preloader from "../utilsComponents/preloader.tsx";
import {Component} from "react";
import {Item} from "../../config.ts";
import List from "./list.tsx";
import ModalError from "../utilsComponents/modalError.tsx";

export default class TopSales extends Component {

    state: {
        url: string,
        loading: boolean,
        list: Array<Item>,
        error: boolean
    } = {
        url: import.meta.env.VITE_URL,
        loading: true,
        list: [],
        error: false
    }

    async componentDidMount() {
        const list = await this.loadList()
        this.setState({loading: false, list})
    }

    async loadList() {
        const response = await fetch(`${this.state.url}/api/top-sales`)
        if (response.status / 100 === 2) return await response.json()
        this.setState({error: true})
    }


    render() {
        if(this.state.list.length === 0 && !this.state.loading) return null

        return (
            <section className="small-block">
                <h2 className="text-center">Хиты продаж!</h2>
                {this.state.loading ? <Preloader/> : !this.state.error ?
                            <List items={this.state.list}/>
                     : <ModalError/>}
            </section>
        )
    }
}