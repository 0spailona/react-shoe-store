import Preloader from "../utilsComponents/preloader.tsx";
import {Component} from "react";
import {Button, Nav} from "react-bootstrap";
import {countLoadItems, Item} from "../../config.ts";
import List from "./list.tsx";
import ModalError from "../utilsComponents/modalError.tsx";

type Props = {
    isPage: boolean,
}

export default class Catalog extends Component<Props> {

    state: {
        url: string,
        loading: boolean,
        loadMoreItemsButtonState: "block" | "none" | "loading",
        categories: Array<{ id: number, title: string }>,
        activeCategory: number,
        list: Array<Item>
        offset: number,
        error: boolean
    } = {
        url: import.meta.env.VITE_URL,
        loading: true,
        loadMoreItemsButtonState: "none",
        categories: [],
        activeCategory: 0,
        list: [],
        offset: countLoadItems,
        error: false
    }

    async componentDidMount() {
        const categories = await this.loadCategories();
        const list = await this.loadList(0,null)
        this.setLoadMoreItemsButtonState(list)
        this.setState({categories, loading: false, list})

    }

    async loadCategories() {
        const response = await fetch(`${this.state.url}/api/categories/`)

        if (response.status / 100 === 2) return await response.json()
        this.setState({error: true})
    }

    async loadList(categoryId: number | null, searchStr:string | null) {

        let addUrl = ""
        if(categoryId || categoryId === 0){
        if (this.state.activeCategory === categoryId && this.state.list.length !== 0) {
            addUrl = categoryId === 0 ? `/api/items?offset=${this.state.offset}` : `/api/items?categoryId=${categoryId}&offset=${this.state.offset}`
        } else {
            addUrl = categoryId === 0 ? `/api/items/` : `/api/items?categoryId=${categoryId}`
        }}

         if(searchStr){

         }

        const response = await fetch(`${this.state.url}${addUrl}`)
        // console.log("response", response)
        if (response.status / 100 === 2) return await response.json()
        this.setState({error: true})
    }

    async getListByCategories(categoryId: number) {
        this.setState({loading: true})
        const list = await this.loadList(categoryId,null)
        this.setLoadMoreItemsButtonState(list)
        this.setState({
            loading: false,
            list,
            activeCategory: categoryId,
        })
    }

    async onSearchFormSubmit(e,str:string){
        /*this.setState({loading: true})
        const list = await this.loadList(null,str)
        this.setLoadMoreItemsButtonState(list)
        this.setState({
            loading: false,
            list
        })*/
    }



    async getMoreItems() {
        this.setState({loadMoreItemsButtonState: "loading"})
        const data = await this.loadList(this.state.activeCategory,null)
        this.setLoadMoreItemsButtonState(data)
        const offset = this.state.offset + countLoadItems
        this.setState({list: [...this.state.list, ...data], offset})
    }

    setLoadMoreItemsButtonState(list: Array<Item>) {
        this.setState({loadMoreItemsButtonState: list.length < countLoadItems ? "none" : "block"});
    }

    render() {
        console.log("this.state.list", this.state.list)
        console.log("this.error",this.state.error)
        return (
            <section className="catalog">
                <h2 className="text-center">Каталог</h2>

                {this.state.loading ? <Preloader/> :
                    !this.state.error ?
                        <>
                            {this.props.isPage ?
                                <form className="catalog-search-form form-inline" onKeyUp={
                                    (e)=> {
                                        if (e.keyCode == 13) {
                                            e.preventDefault()
                                            console.log("e.target", e.target)
                                        }
                                    }}>
                                    <input name="search" className="form-control" placeholder="Поиск" />
                                </form> : null}
                            <Nav className="justify-content-center catalog-categories">
                                <Nav.Item>
                                    <Nav.Link href="#"
                                              className={`${this.state.activeCategory === 0 ? "active" : "text-secondary"}`}
                                              onClick={() => this.getListByCategories(0)}>Все</Nav.Link>
                                </Nav.Item>
                                {this.state.categories.map(x => <Nav.Item key={x.id}>
                                    <Nav.Link href="#"
                                              className={`${this.state.activeCategory === x.id ? "active" : "text-secondary"}`}
                                              data-id={x.id}
                                              onClick={() => this.getListByCategories(x.id)}>{x.title}</Nav.Link>
                                </Nav.Item>)}
                            </Nav>
                            <List items={this.state.list}/>
                            {this.state.loadMoreItemsButtonState === "block" ?
                                <div className="text-center">
                                    <Button variant="outline-secondary" onClick={() => this.getMoreItems()}>Загрузить
                                        ещё</Button>
                                </div> : this.state.loadMoreItemsButtonState === "loading" ?
                                    <>
                                        <Preloader/>
                                        <div className="text-center">
                                            <Button variant="outline-secondary" disabled>Загрузить ещё</Button>
                                        </div>
                                    </> : null
                            }

                        </> : <ModalError/>}
            </section>

        );
    }
}
