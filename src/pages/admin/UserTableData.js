import moment from "moment/moment";
import React from "react";

const UserTableData = ({
  showEditOrDelete,
  user,
  key,
  selectedUsers,
  handleSelectOneUser,
  deleteSingleUser,
  setUserToEdit
}) => {
  return (
    <tr key={key}>
      {/* <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
        
          <label htmlFor={`hs-at-with-checkboxes-${user.id}`} className="flex">
          {showEditOrDelete&&
          <>
            <input
              type="checkbox"
              className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id={`hs-at-with-checkboxes-${user.id}`}
              checked={selectedUsers?.includes(user.id)}
              onChange={() => handleSelectOneUser(user.id)}
            />
             </>
            }
            <span className="block text-sm text-gray-500 dark:text-neutral-500">
              {user?.id}
            </span> 
           
          </label>

        </div>
      </td> */}
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <div className="flex items-center gap-x-3">
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {`${user?.first_name} ${user?.last_name} `}
              </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="h-px w-72 whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
            {user?.country}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500 dark:text-neutral-500">
            {moment(user?.created_at).format("MMMM Do YYYY")}
          </span>
        </div>
      </td>
      {showEditOrDelete&&
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-1.5">
          <button
            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
            onClick={() => setUserToEdit(user)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
          <button
            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
            onClick={() => deleteSingleUser(user.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </svg>
          </button>
        </div>
      </td>
     }
    </tr>
  );
};

export default UserTableData;
