import {Col, Container, Form, Nav, Navbar, Row} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Header() {
const navigate = useNavigate();

    const [searchFormVisible, setSearchFormVisible] = useState<boolean>(false);

    const toggleSearchFarmVisible = ()=>{
        if(!searchFormVisible){
            setSearchFormVisible(true)
        }

    }

    return (
        <Container>
            <Row>
                <Col>
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
                                    <div data-id="search-expander" className="header-controls-pic header-controls-search" onClick={() => toggleSearchFarmVisible()}></div>
                                    <div className="header-controls-pic header-controls-cart" onClick={()=> navigate("/cart")}>
                                        <div className="header-controls-cart-full">1</div>
                                        <div className="header-controls-cart-menu"></div>
                                    </div>
                                </div>
                                <Form data-id="search-form" className={`header-controls-search-form form-inline ${searchFormVisible ? "" : "invisible"}`}>
                                    <Form.Control placeholder="Поиск"/>
                                </Form>
                            </div>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    )
}