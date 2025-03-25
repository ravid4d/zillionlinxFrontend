import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDashboardData } from "../../redux/slices/dashboardSlice";
import { getAllUsers, handleUsersPagination } from "../../redux/slices/userSlice";
import UserTableData from "./UserTableData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.dashboard);
  const { token } = useSelector((state) => state.auth);
  const { users = [], pagination } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getDashboardData()).catch((err) => {
      toast.error("Error fetching dashboard data: " + err.message);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handlePagination = (url) => {
    if (url) dispatch(handleUsersPagination({ url, token }));
  };

  const userStats = [
    { month: "Jan", count: 30 },
    { month: "Feb", count: 45 },
    { month: "Mar", count: 50 },
    { month: "Apr", count: 70 },
    { month: "May", count: 90 },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      

      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col bg-white border shadow rounded-xl p-4 md:p-5">
              <p className="text-xs uppercase text-gray-500">Total Users</p>
              <h3 className="text-xl font-medium text-gray-800">
                {dashboardData?.total_users ?? "Loading..."}
              </h3>
            </div>
            <div className="flex flex-col bg-white border shadow rounded-xl p-4 md:p-5">
              <p className="text-xs uppercase text-gray-500">Total Bookmarks</p>
              <h3 className="text-xl font-medium text-gray-800">
                {dashboardData?.totalBookmark ?? "Loading..."}
              </h3>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-2">User Registrations</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="bg-white border rounded-xl shadow overflow-hidden">
                  <div className="px-6 py-4 grid md:flex md:justify-between md:items-center border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Users</h2>
                  </div>
                  {users.length > 0 ? (
                    <table className="min-w-full divide-y">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-start">ID</th>
                          <th className="px-6 py-3 text-start">Name</th>
                          <th className="px-6 py-3 text-start">Country</th>
                          <th className="px-6 py-3 text-start">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map((user) => (
                          <UserTableData key={user.id} user={{ ...user, country: user.country || "N/A" }} showEditOrDelete={false} />
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-center text-gray-500">No users found.</p>
                  )}
                  <div className="px-6 py-4 flex justify-between border-t">
                    <div className="inline-flex gap-x-2">
                      {pagination.map((page, index) => (
                        <button
                          key={index}
                          type="button"
                          disabled={!page.url}
                          onClick={() => handlePagination(page.url)}
                          className={`${
                            page.active ? "bg-gray-100" : "bg-white"
                          } py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50`}
                        >
                          {index === 0 ? '<' : index === pagination.length - 1 ? '>' : page.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
