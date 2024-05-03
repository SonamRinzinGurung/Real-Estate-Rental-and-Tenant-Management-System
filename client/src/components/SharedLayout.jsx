import { Outlet } from "react-router-dom";
import { Header } from ".";

const SharedLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Outlet />
        </div>
    );
};

export default SharedLayout;
