import { Outlet, useLocation } from "react-router-dom"
import { Header, Footer } from "./components/index.js"
import { useEffect } from "react";

function App() {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])

    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default App
