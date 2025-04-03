import React, { useState } from "react";
import AdminHeader from './AdminHeader';
// import AdminFooter from './AdminFooter';
import AdminSidebar from './AdminSidebar';
import { Outlet } from "react-router-dom";
const AdminLayout = () => {
const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="app-layout">
        {/* <div className="app-content flex flex-wrap w-full">      */}
       <AdminHeader openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <AdminSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        {/* <div className="w-full content-area"> */}
          <Outlet />
        {/* </div> */}
        {/* <AdminFooter /> */}
      {/* // </div> */}
    </div>
  );
};

export default AdminLayout;
