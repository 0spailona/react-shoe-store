import Preloader from "../../utilsComponents/preloader.tsx";
import {Component} from "react";
import {countLoadItems, Item} from "../../../config.ts";
import List from "../list.tsx";
import CatalogNav from "./catalogNav.tsx";
import {Button} from "react-bootstrap";

type Props = {
    isHasSearchForm: boolean,
    searchStr: string
}

export default class Catalog extends Component<Props> {

    state: {
        url: string,
        loading: boolean,
        hasMore: boolean,
        categories: Array<{ id: number, title: string }>,
        activeCategory: number,
        list: Array<Item>
        searchStr: string,
        inputValue: string,
        error: boolean
    } = {
        url: import.meta.env.VITE_URL,
        loading: true,
        hasMore: false,
        categories: [],
        activeCategory: 0,
        list: [],
        searchStr: this.props.searchStr,
        inputValue: "",
        error: false
    }

    async componentDidMount() {
        await this.loadCategories();
        await this.loadList(null, 0, 0)
    }

    async loadCategories() {
        const response = await fetch(`${this.state.url}/api/categories/`)
        if (Math.trunc(response.status / 100) === 2) this.setState({categories: await response.json(), loading: false})
        //this.setState({error: true})
    }


    async loadList(searchStr: string | null, categoryId: number | null, offset: number) {
        this.setState({loading: true})
        //console.log("loadList state.searchStr ", this.state.searchStr)
        searchStr ??= this.state.searchStr
        categoryId ??= this.state.activeCategory

        let url = `${this.state.url}/api/items?`;

        if (searchStr) {
            url += `q=${(searchStr)}&`;
        }

        if (categoryId) {
            url += `categoryId=${(categoryId)}&`
        }

        if (offset) {
            url += `offset=${offset}&`
        }

        // console.log("loadList url",url)
        // console.log("loadList categoryId",categoryId)

        const response = await fetch(url)
        if (Math.trunc(response.status / 100) === 2) {
            const list = await response.json();
            if (offset) {
                this.setState({
                    list: [...this.state.list, ...list],
                    hasMore: list.length >= countLoadItems,
                    loading: false
                })
            } else {
                this.setState({
                    list,
                    hasMore: list.length >= countLoadItems,
                    loading: false,
                    activeCategory: categoryId,
                    searchStr,
                    inputValue: searchStr
                })
            }
        }
        //this.setState({error: true})
    }

    async getFirstListByCategories(categoryId: number) {
        await this.loadList(null, categoryId, 0)
    }

    async getFirstListBySearch(str: string) {
        await this.loadList(str, null, 0)
    }

    async getMoreItems() {
        const offset = this.state.list.length;
        await this.loadList(null, null, offset)
    }

    render() {
        console.log("props.searchStr", this.props.searchStr)
        // console.log("this.state.list", this.state.list)
        //console.log("this.error", this.state.error)
        //console.log("search", this.state.searchStr)
         console.log("input", this.state.inputValue)
        // console.log("activeCategory", this.state.activeCategory)

        const searchField = !this.props.isHasSearchForm ? null :
            <form className="catalog-search-form form-inline"
                  onSubmit={(e) => e.preventDefault()}>
                <input name="search"
                       className={`form-control ${this.state.inputValue === this.state.searchStr ? "text-primary" : ""}`}
                       value={this.state.inputValue}
                       placeholder="Поиск"
                       onKeyUp={e => e.key === "Enter" && this.getFirstListBySearch(e.currentTarget.value)}
                       onChange={(e) => this.setState({inputValue: e.target.value})}
                />
            </form>;

        const categories = this.state.categories.length === 0 ? null :
            <CatalogNav activeCategory={this.state.activeCategory} categories={this.state.categories}
                        changeActiveCategory={(categoryId) => this.getFirstListByCategories(categoryId)}/>;

        const preloader = this.state.loading ? <Preloader/> : null;
        const moreButton = this.state.hasMore ?
            <div className="text-center">
                <Button variant="outline-secondary" disabled={this.state.loading}
                        onClick={this.getMoreItems.bind(this)}>Загрузить
                    ещё</Button>
            </div> : null;

        return (
            <section className="catalog">
                <h2 className="text-center">Каталог</h2>
                {searchField}
                {categories}
                <List items={this.state.list}/>
                {preloader}
                {moreButton}
            </section>
        );
    }
}
