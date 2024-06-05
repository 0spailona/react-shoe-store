import {Col, Container, Form, Nav, Navbar, Row} from "react-bootstrap";
import {useState} from "react";
import {useNavigate,NavLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";
import {headerNav} from "../config.ts";
import {toSearchStr} from "../redux/catalogListSlice.ts";

export default function Header() {
    const navigate = useNavigate();
    const items = useAppSelector(state => state.cart.cartItems)
    //console.log("header cart items",items)
    const dispatch = useAppDispatch()
    const navigator = useNavigate();

    const [searchFormVisible, setSearchFormVisible] = useState<boolean>(false);
    const [inputValue,setInputValue] = useState("");

    const toggleSearchFarmVisible = () => {
        if (!searchFormVisible) {
            setSearchFormVisible(true)
            return
        }
        if(!inputValue){
            setSearchFormVisible(false)
            return
        }
        else{
            dispatch(toSearchStr(inputValue))
            setInputValue("")
            setSearchFormVisible(false)
            navigator("/catalog")
            return
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Navbar expand="sm" variant="light" bg="light">
                        <NavLink to="/" className="navbar-brand"> <img src="./img/header-logo.png" alt="Bosa Noga"/></NavLink>
                        <Navbar.Collapse id="navbarMain">
                            <Nav className="mr-auto">
                                {headerNav.map((navLink, i) => <Nav.Item key={i}>
                                    <NavLink to={navLink.href} className="nav-link active">{navLink.pageName}</NavLink>
                                </Nav.Item>)}
                            </Nav>
                            <div>
                                <div className="header-controls-pics">
                                    <div data-id="search-expander"
                                         className="header-controls-pic header-controls-search"
                                         onClick={() => toggleSearchFarmVisible()}></div>
                                    <div className="header-controls-pic header-controls-cart"
                                         onClick={() => navigate("/cart")}>
                                        {Object.keys(items).length > 0 ?
                                            <div className="header-controls-cart-full">{Object.keys(items).length}</div> : null
                                        }
                                        <div className="header-controls-cart-menu"></div>
                                    </div>
                                </div>
                                <Form data-id="search-form"
                                      className={`header-controls-search-form form-inline ${searchFormVisible ? "" : "invisible"}`}
                                      onSubmit={(e) => e.preventDefault()}>
                                    <Form.Control placeholder="Поиск"
                                                  value={inputValue}
                                                  onChange={(e)=>setInputValue(e.target.value)}
                                                  onKeyUp={e => e.key === "Enter" && toggleSearchFarmVisible()}
                                    />
                                </Form>
                            </div>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    )
}