import Header from "../common/header";
import Footer from "../common/footer"
import { Outlet } from "react-router-dom";
const UserLayout = () => {
    return (
        <>
            {/* header*/}
            <Header />
           {/* main */}
            <main>
                <Outlet/>
            </main>
            {/* footer */}
            <Footer/>
        </>
    );
};


export default UserLayout;