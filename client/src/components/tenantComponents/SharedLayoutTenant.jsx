import { Outlet } from "react-router-dom";
import { Header } from "..";

const SharedLayoutTenant = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default SharedLayoutTenant;
