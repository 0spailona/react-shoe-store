import {Nav} from "react-bootstrap";


type Props ={
    activeCategory:number;
    categories:Array<{ id: number, title: string }>;
    changeActiveCategory:(id :number) => void
}

export default function CatalogNav({activeCategory,categories,changeActiveCategory}: Props) {

    //console.log("CatalogNav activeCategory", activeCategory)

    return (
        <Nav className="justify-content-center catalog-categories m-5">
            <Nav.Item>
                <Nav.Link href="#"
                          className={`${activeCategory === 0 ? "active" : "text-secondary"}`}
                          onClick={() => {
                              //console.log("onClick")
                              changeActiveCategory(0)
                          }}>Все</Nav.Link>
            </Nav.Item>
            {categories.map(x => <Nav.Item key={x.id}>
                <Nav.Link href="#"
                          className={`${activeCategory === x.id ? "active" : "text-secondary"}`}
                          data-id={x.id}
                          onClick={() => {
                             // console.log("onClick")
                              changeActiveCategory(x.id)
                          }}>{x.title}</Nav.Link>
            </Nav.Item>)}
        </Nav>
    )
}