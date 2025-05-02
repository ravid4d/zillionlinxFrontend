import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  handleUsersPagination
} from "../../redux/slices/userSlice";
import { deleteUser, setSearchQuery } from "../../redux/slices/adminSlice";
import UserTableData from "./UserTableData";
import UpdateUser from "../../components/admin/UpdateUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";

const User = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.admin);
  const { users, totalUsers, pagination, loading, error } = useSelector(
    (state) => state.user
  );
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState({});
  const [userToEditModal, setUserToEditModal] = useState(false);
  const [filterBy, setFilterBy] = useState({
    sort_by: "name",
    sort_order: "desc"
  });

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
          dispatch(getAllUsers(filterBy));
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
      cancelButtonText: "No, cancel"
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
          setSelectedUsers([]); // Clear selection after deletion
          dispatch(getAllUsers(filterBy));
        })
        .catch((err) => {
          console.error("Error deleting users: " + err.message);
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
      cancelButtonText: "No, cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete();
        Swal.fire("Deleted!", "Users have been removed.", "success");
      }
    });
  };

  useEffect(() => {
    dispatch(getAllUsers(filterBy));
  }, [dispatch, debouncedQuery]);

  useEffect(() => {
    filterBy && dispatch(getAllUsers(filterBy));
  }, [filterBy]);

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""));
    };
  }, [dispatch]);

  const handlePagination = async (url) => {
    dispatch(
      handleUsersPagination({
        url: `${url}&sort_by=${filterBy?.sort_by}&sort_order=${filterBy?.sort_order}`,
        token
      })
    );
  };

  // Open User Edit Modal
  useEffect(() => {
    if (
      typeof userToEdit === "object" &&
      userToEdit !== null &&
      !Array.isArray(userToEdit) &&
      Object.keys(userToEdit).length > 0
    ) {
      setUserToEditModal(true);
    }
  }, [userToEdit]);

  const setUsersByFilter = (filter) => {
    setFilterBy((prev) => ({
      sort_by: filter?.sort_by,
      sort_order:
        prev?.sort_by === filter?.sort_by && prev?.sort_order === "desc"
          ? "asc"
          : "desc"
    }));
  };

  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 overflow-x-auto rounded-xl shadow-2xs overflow-hidden ">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Users</h2>
              <p className="text-sm text-gray-600 ">
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

          {loading?.getAllUsers ? (
            <div className="flex flex-wrap justify-center w-full py-10"><span className="loader"></span></div>
          ) : users && users?.length > 0 ? (
            <>
              <div
                className={`overlay z-50 hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50  ${
                  userToEditModal
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                }`}
                id="updateUser-backdrop"
              ></div>
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-50 ">
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
                          className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                          id="hs-at-with-checkboxes-main"
                        />
                        {/* <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          ID
                        </span>  */}
                      </label>
                    </th>

                    <th scope="col" className="px-6 py-3">
                      <div
                        onClick={() => setUsersByFilter({ sort_by: "name" })}
                        className="flex items-center gap-x-2"
                      >
                        <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          <span>Name</span>
                          <svg
                            className="shrink-0 size-3.5 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                          </svg>
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                      <div
                        onClick={() => setUsersByFilter({ sort_by: "country" })}
                        className="flex items-center gap-x-2"
                      >
                        <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          <span>Country</span>
                          <svg
                            className="shrink-0 size-3.5 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                          </svg>
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                      <div
                        onClick={() =>
                          setUsersByFilter({ sort_by: "last_access" })
                        }
                        className="flex items-center gap-x-2"
                      >
                        <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          <span>Last access date</span>
                          <svg
                            className="shrink-0 size-3.5 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                          </svg>
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <div
                        onClick={() =>
                          setUsersByFilter({ sort_by: "total_bookmarks" })
                        }
                        className="flex items-center gap-x-2"
                      >
                        <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          <span>number of bookmarks</span>
                          <svg
                            className="shrink-0 size-3.5 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                          </svg>
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <div
                        onClick={() => setUsersByFilter({ sort_by: "created" })}
                        className="flex items-center gap-x-2"
                      >
                        <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          <span>Created</span>
                          <svg
                            className="shrink-0 size-3.5 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                          </svg>
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 flex flex-wrap items-center gap-1">
                          Action
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 ">
                  {users?.map((user, index) => {
                    return (
                      <tr key={user?.id || `user-${index}`}>
                        <UserTableData
                          showEditOrDelete={true}
                          user={user}
                          selectedUsers={selectedUsers}
                          handleSelectOneUser={handleSelectOneUser}
                          deleteSingleUser={deleteSingleUser}
                          setUserToEdit={setUserToEdit}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {userToEditModal && (
                <UpdateUser
                  userToEditModal={userToEditModal}
                  setUserToEditModal={setUserToEditModal}
                  userToEdit={userToEdit}
                />
              )}
            </>
          ) : (
            <div className=" flex justify-center items-center">
              <img src="/no-data-concept.jpeg" alt="No Data Found!" />
            </div>
          )}
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
            {
              totalUsers >0  &&
            <div>
              <p className="text-sm text-gray-600 ">
                <span className="font-semibold text-gray-800">
                  {totalUsers}
                </span>{" "}
                results
              </p>
            </div>
            }

            {/* Counter Pagination */}
            <div className="inline-flex gap-x-2">
              {pagination &&
                pagination?.length > 3 &&
                pagination?.map((pageNumber, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={pageNumber?.url === null}
                      onClick={() => handlePagination(pageNumber?.url)}
                      className={`${
                        pageNumber?.active ? "bg-gray-100" : "bg-white"
                      } py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 `}
                    >
                      {index === 0
                        ? "<"
                        : index === pagination?.length - 1
                        ? ">"
                        : pageNumber?.label}
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
