import {Container, Nav, Navbar} from "react-bootstrap";

export default function Header() {
    return (
        <Container className="">
            <div className="row">
                <div className="col">
                    <Navbar expand="sm" className="navbar-light bg-light">
                        <Navbar.Brand href="/"> <img src="./img/header-logo.png" alt="Bosa Noga"/></Navbar.Brand>
                        <Navbar.Collapse id="navbarMain">
                            <Nav className="mr-auto">
                                <Nav.Item>
                                    <Nav.Link href="/" className="nav-link active">Главная</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/catalog" className="nav-link active">Каталог</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/about" className="nav-link active">О магазине</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="/contacts" className="nav-link active">Контакты</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div>
                                <div className="header-controls-pics">
                                    <div data-id="search-expander" className="header-controls-pic header-controls-search"></div>
                                    <div className="header-controls-pic header-controls-cart">
                                        <div className="header-controls-cart-full">1</div>
                                        <div className="header-controls-cart-menu"></div>
                                    </div>
                                </div>
                                <form data-id="search-form" className="header-controls-search-form form-inline invisible">
                                    <input className="form-control" placeholder="Поиск"/>
                                </form>
                            </div>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </Container>
    )
}