import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  handleUsersPagination
} from "../../redux/slices/userSlice";
import { deleteUser } from "../../redux/slices/adminSlice";
import UserTableData from "./UserTableData";
import UpdateUser from "../../components/admin/UpdateUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const User = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { users, totalUsers, pagination } = useSelector(
    (state) => state.user
  );

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState({});
  const [userToEditModal, setUserToEditModal] = useState(false);

  //Select / Unselect all the users
  const handleSelectAllUsers = () => {
    selectedUsers?.length === users?.length 
      ? setSelectedUsers([])
      : setSelectedUsers(users?.map((user) => user?.id));
  };

  //Select / Unselect individual user
  const handleSelectOneUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  //Delete single user
  const deleteSingleUser = (ids) => {
    if (!ids || ids.length === 0) {
      toast.warning("No users selected!");
      return;
    }
  
    const confirmDelete = () => {
      dispatch(deleteUser({ ids, token }))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully!");
          setSelectedUsers([]); // Clear selection
          dispatch(getAllUsers()); 
        })
        .catch((err) => {
          toast.error("Error deleting user: " + err.message);
        });
    };
  
    // Show confirmation toast with Yes/No buttons
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#5bc0de",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete();
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };  

  //Delete selected users.
  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected!", { position: "top-center" });
      return;
    }
  
    const confirmDelete = () => {
      dispatch(deleteUser({ ids: selectedUsers, token }))
        .unwrap()
        .then(() => {
          toast.success("Users deleted successfully!", { position: "top-center" });
          setSelectedUsers([]); // Clear selection after deletion
          dispatch(getAllUsers()); 
        })
        .catch((err) => {
          toast.error("Error deleting users: " + err.message, { position: "top-center" });
        });
    };
  
    // Show confirmation toast with Yes/No buttons
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete these users?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#5bc0de",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete();
        Swal.fire("Deleted!", "Users have been removed.", "success");
      }
    });
  };
  

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handlePagination = async (url) => {
    dispatch(handleUsersPagination({ url, token }));
  };

  // Open User Edit Modal
  useEffect(()=>{
    if(typeof userToEdit === "object" && userToEdit !== null && !Array.isArray(userToEdit) && Object.keys(userToEdit).length > 0) {
      setUserToEditModal(true);
    }
  },[userToEdit])

  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Users
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Edit and delete users.
              </p>
            </div>
            <div>
              <div className="inline-flex gap-x-2">
                <button
                  onClick={handleDeleteSelected}
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
                  disabled={selectedUsers.length === 0 ? "disabled" : ""}
                >
                  Delete all ({selectedUsers.length})
                </button>
              </div>
            </div>
          </div>
          {/* {!userLoading && (
            <div className="animate-spin inline-block size-6 border-3 border-red-400 border-t-transparent text-gray-800 rounded-full" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
          )} */}
          {users && users?.length > 0 ? (
            <>
              <div
        className={`overlay z-50 hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 ${
          userToEditModal ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id="updateUser-backdrop"
      ></div>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <label
                        htmlFor="hs-at-with-checkboxes-main"
                        className="flex"
                      >
                        <input
                          type="checkbox"
                          onChange={handleSelectAllUsers}
                          checked={
                            selectedUsers.length === users.length &&
                            users.length > 0
                          }
                          className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                          id="hs-at-with-checkboxes-main"
                        />
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          ID
                        </span>
                      </label>
                    </th>

                    <th
                      scope="col"
                      className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                    >
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Name
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Country
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Created
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-end"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {users?.map((user) => {
                    return (
                      <UserTableData
                      showEditOrDelete={true}
                        user={user}
                        key={user?.id}
                        selectedUsers={selectedUsers}
                        handleSelectOneUser={handleSelectOneUser}
                        deleteSingleUser={deleteSingleUser}
                        setUserToEdit={setUserToEdit}
                      />
                    );
                  })}
                </tbody>
              </table>
              {
              userToEditModal &&
              <UpdateUser userToEditModal={userToEditModal} setUserToEditModal={setUserToEditModal} userToEdit={userToEdit} />
              }
            </>
          ) : null}
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                <span className="font-semibold text-gray-800 dark:text-neutral-200">
                  {totalUsers}
                </span>{" "}
                results
              </p>
            </div>

            {/* Counter Pagination */}
            <div className="inline-flex gap-x-2">
              {pagination.map((pageNumber, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={pageNumber?.url === null}
                    onClick={() => handlePagination(pageNumber?.url)}
                    className={`${
                      pageNumber?.active ? "bg-gray-100" : "bg-white"
                    } py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800`}
                  >
                    {
                    index===0 ? '<' : index === pagination?.length-1 ? '>' : pageNumber?.label
                  }
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
