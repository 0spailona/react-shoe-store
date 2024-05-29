import Preloader from "./preloader.tsx";
import {Component} from "react";
import {Nav} from "react-bootstrap";
import {Item} from "../config.ts";
import List from "./list.tsx";

type Props = {
    isPage: boolean,
}

export default class Catalog extends Component<Props> {

    state: {
        url: string,
        loading: boolean,
        categories: Array<{ id: number, title: string }>,
        activeCategory: number,
        list: Array<Item>
    } = {
        url: import.meta.env.VITE_URL,
        loading: true,
        categories: [],
        activeCategory: -1,
        list: []
    }

    async componentDidMount() {
        const categories = await this.loadCategories();
        const list = await this.loadList()

        if (!categories || !list) {
            alert("404")
            return
        }

        this.setState({categories, loading: false, list})
    }

    async loadCategories() {
        const response = await fetch(`${this.state.url}/api/categories/`)
        const data = await response.json()
        console.log("categories", data)
        return await data
    }

    async loadList() {
        const response = await fetch(`${this.state.url}/api/items/`)
        const list = await response.json()
        console.log("list", list)
        return await list
    }


    render() {
        return (
            <section className="catalog">
                <h2 className="text-center">Каталог</h2>

                {this.state.loading && <Preloader/>}
                {!this.state.loading && this.props.isPage ? <form className="catalog-search-form form-inline">
                    <input className="form-control" placeholder="Поиск"/>
                </form> : null}
                {!this.state.loading &&
                    <Nav className="justify-content-center catalog-categories">
                        <Nav.Item>
                            <Nav.Link href="#"
                                      className={`nav-link ${this.state.activeCategory === -1 ? "active" : ""}`}>Все</Nav.Link>
                        </Nav.Item>
                        {this.state.categories.map(x => <Nav.Item key={x.id}>
                            <Nav.Link href="#"
                                      className={`nav-link ${this.state.activeCategory === x.id ? "active" : ""}`}
                                      data-id={x.id}>{x.title}</Nav.Link>
                        </Nav.Item>)}
                    </Nav>
                }
                <List items={this.state.list}/>
                {!this.state.loading && <div className="text-center">
                    <button className="btn btn-outline-primary">Загрузить ещё</button>
                </div>}
            </section>

        );
    }
}
