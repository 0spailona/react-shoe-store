import Preloader from "../../utilsComponents/preloader.tsx";
import {Component} from "react";
import {GlobalState} from "../../../config.ts";
import CatalogNav from "./catalogNav.tsx";
import {Button, Form} from "react-bootstrap";
import {AppDispatch} from "../../../redux/store.ts";
import {connect} from "react-redux";
import {
    cleanStore,
    fetchCatalogList,
    fetchCategories,
    toActiveCategory, toSearchStr
} from "../../../redux/slices/catalogListSlice.ts";
import CatalogList from "./catalogList.tsx";

type Props = {
    isHasSearchForm: boolean,
    searchStr: string,
    loading: boolean,
    hasMore: boolean,
    categories: Array<{ id: number, title: string }>,
    activeCategory: number,
    loadCategories: (url: string) => void,
    toActiveCategory:(url: number) => void,
    toSearchStr:(url: string) => void,
    loadList:() => void,
    cleanStore: () => void,
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
        this.props.loadList()
        this.setState({inputValue: this.props.searchStr})
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if(prevProps.searchStr !== this.props.searchStr){
            this.setState({inputValue: this.props.searchStr})
        }
    }

    render() {
        const searchField = !this.props.isHasSearchForm ? null :
            <Form className="catalog-search-form"
                  onSubmit={(e) => e.preventDefault()}>
                <Form.Control name="search"
                       className={`${this.state.inputValue === this.props.searchStr ? "text-primary" : ""}`}
                       value={this.state.inputValue}
                       placeholder="Поиск"
                       onKeyUp={e => e.key === "Enter" && this.props.toSearchStr(e.currentTarget.value)}
                       onChange={(e) => this.setState({inputValue: e.target.value})}
                />
            </Form>;

        const categories = this.props.categories.length === 0 ? null :
            <CatalogNav activeCategory={this.props.activeCategory} categories={this.props.categories}
                        changeActiveCategory={(categoryId) =>this.props.toActiveCategory(categoryId)}/>;

        const preloader = this.props.loading ? <Preloader/> : null;
        const moreButton = this.props.hasMore ?
            <div className="text-center">
                <Button variant="outline-secondary" disabled={this.props.loading}
                        onClick={()=>this.props.loadList()}>Загрузить
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
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        loadCategories: (url: string) => dispatch(fetchCategories(url)),
        toActiveCategory:(categoryId:number) => dispatch(toActiveCategory(categoryId)),
        toSearchStr:(str:string) => dispatch(toSearchStr(str)),
        loadList:() => dispatch(fetchCatalogList()),
        cleanStore: () => dispatch(cleanStore())
    };
};
// eslint-disable-next-line
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

