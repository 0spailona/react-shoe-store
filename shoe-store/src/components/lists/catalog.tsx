import Preloader from "../utilsComponents/preloader.tsx";
import {Component} from "react";
import {Button, Form, Nav} from "react-bootstrap";
import {Item} from "../../config.ts";
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
        const list = await this.loadList(-1)

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

    async loadList(categoryId:number) {

        let list
        if(categoryId === -1){
           const response = await fetch(`${this.state.url}/api/items/`)
            list = await response.json()
            //console.log("list", list)
        }
        else {
            const response = await fetch(`${this.state.url}/api/items?categoryId=${categoryId} `)
            list = await response.json()
            //console.log("category", list)
            //console.log("list by category", list)
        }

        //const list = await response.json()

        return await list
    }

    async loadListByCategories(categoryId: number) {
        this.setState({loading: true})
        this.setState({ loading: false, list:await this.loadList(categoryId),activeCategory:categoryId})
    }


    render() {

        return (
            <section className="catalog">
                <h2 className="text-center">Каталог</h2>

                {this.state.loading ? <Preloader/> :
                    <>
                        {this.props.isPage ?
                            <Form className="catalog-search-form form-inline">
                                <Form.Control placeholder="Поиск"/>
                            </Form> : null}
                        <Nav className="justify-content-center catalog-categories">
                            <Nav.Item>
                                <Nav.Link href="#"
                                          className={`${this.state.activeCategory === -1 ? "active" : "text-secondary"}`}
                                onClick={() => this.loadListByCategories(-1)}>Все</Nav.Link>
                            </Nav.Item>
                            {this.state.categories.map(x => <Nav.Item key={x.id}>
                                <Nav.Link href="#"
                                          className={`${this.state.activeCategory === x.id ? "active" : "text-secondary"}`}
                                          data-id={x.id}
                                          onClick={() => this.loadListByCategories(x.id)}>{x.title}</Nav.Link>
                            </Nav.Item>)}
                        </Nav>
                        <List items={this.state.list}/>
                        <div className="text-center">
                            <Button variant="outline-secondary">Загрузить ещё</Button>
                        </div>
                    </>}
            </section>

        );
    }
}
