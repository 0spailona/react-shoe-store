import Preloader from "../../utilsComponents/preloader.tsx";
import {Component} from "react";
import {GlobalState} from "../../../config.ts";
import CatalogNav from "./catalogNav.tsx";
import {Button, Form} from "react-bootstrap";
import {AppDispatch} from "../../../redux/store.ts";
import {connect} from "react-redux";
import { cleanStore, fetchCatalogList, fetchCategories} from "../../../redux/catalogListSlice.ts";
import CatalogList from "./catalogList.tsx";

type Props = {
    isHasSearchForm: boolean,
    searchStr: string,
    loading: boolean,
    hasMore: boolean,
    categories: Array<{ id: number, title: string }>,
    activeCategory: number,
    loadList: (pattern: {
        categoryId: number,
        searchStr: string,
        offset: { isOffset: boolean, size: number }
    }) => void,
    loadCategories: (url: string) => void,
    cleanStore: () => void,
    listLength: number
}

class Catalog extends Component<Props> {

    state: {
        inputValue: string,
    } = {
        inputValue: "",
    }

    componentDidMount() {
        this.props.cleanStore()
        this.props.loadCategories("/api/categories/")
        this.props.loadList({
            categoryId: this.props.activeCategory,
            searchStr: this.props.searchStr,
            offset: {isOffset: false, size: 0}
        })
        this.setState({inputValue: this.props.searchStr})
    }

    getFirstListByCategories(categoryId: number) {
        //console.log("getFirstListByCategories categoryId", categoryId)
        this.props.cleanStore()
        this.setState({inputValue: this.props.searchStr})
        this.props.loadList({
            categoryId: categoryId,
            searchStr: this.props.searchStr,
            offset: {isOffset: false, size:0}
        })
    }

    async getFirstListBySearch(str: string) {
        this.props.cleanStore()
        this.props.loadList({
            categoryId: this.props.activeCategory,
            searchStr: str,
            offset: {isOffset: false, size:0}
        })
    }

    getMoreItems() {
        this.props.loadList({
            categoryId: this.props.activeCategory,
            searchStr: this.props.searchStr,
            offset: {isOffset: true, size: this.props.listLength}
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if(prevProps.searchStr !== this.props.searchStr){
            this.setState({inputValue: this.props.searchStr})
            this.props.loadList({
                categoryId: this.props.activeCategory,
                searchStr: this.props.searchStr,
                offset: {isOffset: false, size:0}
            })
        }
    }

    render() {
        //console.log("props.searchStr", this.props.searchStr)
        // console.log("this.state.list", this.state.list)
        //console.log("search", this.props.searchStr)
        // console.log("input", this.state.inputValue)
        //console.log("activeCategory", this.props.activeCategory)
        //console.log("hasMore", this.props.hasMore)

        const searchField = !this.props.isHasSearchForm ? null :
            <Form className="catalog-search-form"
                  onSubmit={(e) => e.preventDefault()}>
                <Form.Control name="search"
                       className={`${this.state.inputValue === this.props.searchStr ? "text-primary" : ""}`}
                       value={this.state.inputValue}
                       placeholder="Поиск"
                       onKeyUp={e => e.key === "Enter" && this.getFirstListBySearch(e.currentTarget.value)}
                       onChange={(e) => this.setState({inputValue: e.target.value})}
                />
            </Form>;

        const categories = this.props.categories.length === 0 ? null :
            <CatalogNav activeCategory={this.props.activeCategory} categories={this.props.categories}
                        changeActiveCategory={(categoryId) => this.getFirstListByCategories(categoryId)}/>;

        const preloader = this.props.loading ? <Preloader/> : null;
        const moreButton = this.props.hasMore ?
            <div className="text-center">
                <Button variant="outline-secondary" disabled={this.props.loading}
                        onClick={this.getMoreItems.bind(this)}>Загрузить
                    ещё</Button>
            </div> : null;

        return (
            <section className="catalog">
                <h2 className="text-center">Каталог</h2>
                {searchField}
                {categories}
                <CatalogList/>
                {preloader}
                {moreButton}
            </section>
        );
    }
}


const mapStateToProps = (state: GlobalState) => {

    const catalogSlice = state.catalogList
    return {
        loading: catalogSlice.loading,
        categories: catalogSlice.categories,
        activeCategory: catalogSlice.activeCategory,
        hasMore: catalogSlice.hasMore,
        searchStr: catalogSlice.searchStr,
        error: catalogSlice.error,
        listLength: catalogSlice.listLength
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        loadList: (pattern: {
            categoryId: number,
            searchStr: string,
            offset: { isOffset: boolean, size: number }
        }) => dispatch(fetchCatalogList(pattern)),
        loadCategories: (url: string) => dispatch(fetchCategories(url)),
        cleanStore: () => dispatch(cleanStore())
    };
};
// eslint-disable-next-line
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

