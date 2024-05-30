import Preloader from "../utilsComponents/preloader.tsx";
import {Component} from "react";
import {Item} from "../../config.ts";
import List from "./list.tsx";
import {Row} from "react-bootstrap";

export default class TopSales extends Component {

    state: {
        url: string,
        loading: boolean,
        list: Array<Item>
    } = {
        url: import.meta.env.VITE_URL,
        loading: true,
        list: []
    }

    async componentDidMount() {
        const list = await this.loadList()

        if (!list) {
            alert("404")
            return
        }

        this.setState({loading: false, list})
    }

    async loadList() {
        const response = await fetch(`${this.state.url}/api/top-sales`)
        const list = await response.json()
        console.log("top-list", list)
        return await list
    }


    render() {
        if(this.state.list.length === 0) return null

        return (
            <section className="small-block">
                <h2 className="text-center">Хиты продаж!</h2>
                {this.state.loading ? <Preloader/> :
                    <>
                        <Row>
                            <List items={this.state.list}/>
                        </Row>
                    </>}
            </section>
        )
    }
}