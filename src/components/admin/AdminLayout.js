import React from "react";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminSidebar from './AdminSidebar';
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const AdminLayout = () => {

  return (
    <div className="app-layout">
        {/* <div className="app-content flex flex-wrap w-full">      */}
        <ToastContainer hideProgressBar={true} autoClose={2000} />
       <AdminHeader />
        <AdminSidebar />
        {/* <div className="w-full content-area"> */}
          <Outlet />
        {/* </div> */}
        <AdminFooter />
      {/* // </div> */}
    </div>
  );
};

export default AdminLayout;
