import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";
import {Container} from "react-bootstrap";
import {Route, Routes} from 'react-router-dom';
import Main from "./components/main.tsx";
import Contacts from "./components/info/contacts.tsx";
import AboutStore from "./components/info/aboutStore.tsx";
import Banner from "./components/banner.tsx";
import Catalog from "./components/lists/catalog.tsx";
import ProductCard from "./components/productCard/productCard.tsx";
import Cart from "./components/cart/Cart.tsx";


function App() {

    return (
        <>
            <Header/>
            <Container>
                <Banner/>
            </Container>
            <Container>
                <div className="row">
                    <div className="col">
                        <Routes>
                            <Route path="/" element={<Main/>}/>
                            <Route path="/contacts" element={<Contacts/>}/>
                            <Route path="/about" element={<AboutStore/>}/>
                            <Route path="/catalog" element={<Catalog isPage={true}/>}/>
                            <Route path="/productCard/:id" element={<ProductCard/>}/>
                            <Route path="/cart" element={<Cart/>}/>
                        </Routes>
                    </div>
                </div>
            </Container>
            <Footer/>
        </>
    );
}

export default App;
