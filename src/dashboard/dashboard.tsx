import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import userData from "../usersData.json";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

interface User {
  id: string;
  email: string | null;
  password: string;
  provider: string | null;
  roleCode: string | null;
  businessUnitId: string | null;
  username: string;
  status: "ACTIVE" | "INACTIVE" | string;
  firstName: string | null;
  lastName: string | null;
  department: string | null;
  phoneNumber: string | null;
  activeDirectoryId: number | null;
  createdAt: string | null;
  modifiedAt: string | null;
  createdById: string | null;
  modifiedById: string | null;
}
const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userToRead, setUserToRead] = useState<User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [activeSort, setActiveSort] = useState<"asc" | "desc" | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
const [dropdownPosition, setDropdownPosition] = useState<"above" | "below">(
  "below"
);
// Load data - in a real app you might fetch from an API
  useEffect(() => {
    setUsers(userData);
  }, []);

//Filtering
const filteredUsers = useMemo(() => {
  let result = users
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower) ||
        user.roleCode?.toLowerCase().includes(searchLower) ||
        user.phoneNumber?.includes(searchTerm)
      );
    })
    .filter((user) => statusFilter === "ALL" || user.status === statusFilter);

//Sorting
  if (sortOrder) {
    result = result.sort((a, b) =>
      sortOrder === "asc"
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    );
  }

  return result;
}, [users, searchTerm, statusFilter, sortOrder]);

const handleSortAsc = () => {
  setSortOrder(activeSort === "asc" ? null : "asc");
  setActiveSort(activeSort === "asc" ? null : "asc");
  setActiveDropdown(null);
};

const handleSortDesc = () => {
  setSortOrder(activeSort === "desc" ? null : "desc");
  setActiveSort(activeSort === "desc" ? null : "desc");
  setActiveDropdown(null);
};
const resetAllFilters = () => {
  setSearchTerm("");
  setSortOrder(null);
  setActiveSort(null);
  setStatusFilter("ALL");
  setCurrentPage(1);
  setActiveDropdown(null);
};

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handlers
  const handleOpenUpdateModal = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToUpdate(user);
      setShowUpdateModal(true);
      setActiveDropdown(null); // Close dropdown when opening modal
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToUpdate) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userToUpdate.id ? userToUpdate : user
      )
    );
    setShowUpdateModal(false);

    // Optional: Reset to first page after update
    setCurrentPage(1);
  };
  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [newUser, setNewUser] = useState<Partial<User>>({
    status: "ACTIVE",
    provider: "MANUAL",
    password: "",
    businessUnitId: null,
    activeDirectoryId: null,
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // effect to close dropdown when clicking outside
 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (activeDropdown) {
       // Check if clicked outside any dropdown button or menu
       const dropdownButton = document.getElementById(
         `${activeDropdown}-dropdown-button`
       );
       const dropdownMenu = document.querySelector(
         `[data-dropdown-menu="${activeDropdown}"]`
       );

       if (
         dropdownButton &&
         !dropdownButton.contains(event.target as Node) &&
         dropdownMenu &&
         !dropdownMenu.contains(event.target as Node)
       ) {
         setActiveDropdown(null);
       }
     }
   };

   document.addEventListener("mousedown", handleClickOutside);
   return () => {
     document.removeEventListener("mousedown", handleClickOutside);
   };
 }, [activeDropdown]);

  // Change page
const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

const handleCreateUser = (e: React.FormEvent) => {
  e.preventDefault();

  const userToAdd: User = {
    ...newUser,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    createdById: "current-user-id",
    modifiedById: "current-user-id",
  } as User;

  setUsers((prev) => [...prev, userToAdd]);

  // Reset form and close modal
  setShowCreateModal(false);
  setNewUser({
    status: "ACTIVE",
    provider: "MANUAL",
    password: "",
    businessUnitId: null,
    activeDirectoryId: null,
  });

  // Reset to first page to see the new user
  setCurrentPage(1);
};
  // When opening read modal
  useEffect(() => {
    if (!showUpdateModal) {
      setUserToUpdate(null);
    }
  }, [showUpdateModal]);
  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setShowUpdateModal(false);

    // Adjust current page if we deleted the last user on the page
    if (currentUsers.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const DetailItem = ({
    label,
    value,
    children,
  }: {
    label: string;
    value?: string | null;
    children?: ReactNode;
  }) => (
    <div>
      <p className="text-md font-medium text-gray-500 dark:text-gray-800">
        {label}
      </p>
      {children ? (
        children
      ) : (
        <p className="text-sm text-gray-900 dark:text-gray-400">
          {value || "N/A"}
        </p>
      )}
    </div>
  );

  // Date formatting utility
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };



const handleDropdownClick = (
  e: React.MouseEvent<HTMLButtonElement>,
  userId: string
) => {
  e.preventDefault();
  e.stopPropagation();

  const button = e.currentTarget;
  const buttonRect = button.getBoundingClientRect();
  const dropdownHeight = 176; // Approx height (44px × 4 items)
  const spaceBelow = window.innerHeight - buttonRect.bottom;

  setDropdownPosition(spaceBelow < dropdownHeight ? "above" : "below");
  setActiveDropdown(activeDropdown === userId ? null : userId);
};

  return (
    <>
      <Navbar></Navbar>
      <div>
        <section
          className="bg-gray-50 dark:bg-gray-900 mt-18 p-10 sm:p-5 antialiased  min-h-screen 
                w-full mx-auto 
                px-4 sm:px-6 md:px-8 lg:px-10 
                py-4 sm:py-4 md:py-8 lg:py-8"
        >
          <div
            className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg 
                w-full mx-auto 
                px-4 sm:px-6 md:px-8 lg:px-25 
                py-4 sm:py-6 md:py-8 lg:py-8
                max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl"
          >
            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-4 px-2 dark:bg-gray-800">
              <div className="w-full md:w-1/2">
                <form
                  className="flex justify-between"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="simple-search " className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full ">
                    <div className=" absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className=" ps-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 dark:text-gray-700 ">
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0 dark:text-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center  text-white  bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 "
                  >
                    <svg
                      className="h-3.5 w-3.5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      />
                    </svg>
                    Add User
                  </button>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0 dark:bg-gray-700">
                  <div className="relative dark:bg-gray-600">
                    <button
                      id="filterDropdownButton"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "filter" ? null : "filter"
                        )
                      }
                      className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium focus:outline-none bg-white rounded border hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-700  dark:border-gray-600 dark:hover:text-gray-400 dark:hover:bg-gray-700 dark:text-gray-300 ${
                        statusFilter !== "ALL" ||
                        activeSort !== null ||
                        searchTerm
                          ? "text-primary-700 border-primary-600 dark:text-primary-500 dark:border-primary-500 "
                          : "text-gray-900 border-gray-200 dark:bg-gray-500"
                      }`}
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className={`h-4 w-4 mr-1.5 -ml-1 ${
                          statusFilter !== "ALL" ||
                          sortOrder !== "asc" ||
                          searchTerm
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-400 dark:text-gray-800"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Filter options
                      {/* Show dot indicator when filters are active */}
                      {(statusFilter !== "ALL" ||
                        activeSort !== null ||
                        searchTerm) && (
                        <span className="flex absolute -top-1 -right-1">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                      )}
                      <svg
                        className="-mr-1 ml-1.5 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {activeDropdown === "filter" && (
                      <div
                        className="z-10 absolute right-0 mt-2 w-56 bg-white rounded-lg shadow dark:bg-gray-100"
                        data-dropdown-menu="filter"
                      >
                        <div className="dark:bg-gray-100 rounded-t-2xl p-3 ">
                          <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                            Sort by Username
                          </h6>
                          <ul className="space-y-1">
                            <li>
                              <button
                                onClick={handleSortAsc}
                                className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-400"
                              >
                                <span>A to Z</span>
                                {activeSort === "asc" && (
                                  <svg
                                    className="w-4 h-4 ml-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={handleSortDesc}
                                className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-400"
                              >
                                <span>Z to A</span>
                                {activeSort === "desc" && (
                                  <svg
                                    className="w-4 h-4 ml-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            </li>
                          </ul>
                        </div>
                        <div className="p-3 border-t border-gray-200 dark:border-gray-600 dark:bg-gray-100">
                          <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                            Filter by Status
                          </h6>

                          <ul className="space-y-1">
                            <li>
                              <button
                                onClick={() => {
                                  setStatusFilter("ALL");
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-400"
                              >
                                <span>All Users</span>
                                {statusFilter === "ALL" && (
                                  <svg
                                    className="w-4 h-4 ml-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  setStatusFilter("ACTIVE");
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100  dark:text-gray-500 dark:hover:bg-gray-400"
                              >
                                <span>Active</span>
                                {statusFilter === "ACTIVE" && (
                                  <svg
                                    className="w-4 h-4 ml-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  setStatusFilter("INACTIVE");
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-400"
                              >
                                <span>Inactive</span>
                                {statusFilter === "INACTIVE" && (
                                  <svg
                                    className="w-4 h-4 ml-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            </li>
                          </ul>
                        </div>
                        <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => {
                              resetAllFilters();
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center justify-center p-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-600 dark:hover:bg-red-200 dark:rounded-2xl"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Reset All Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Table content */}
            <div className="overflow-x-auto rounded-t-2xl">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-left text-gray-500 dark:text-gray-400  ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Username
                    </th>
                    <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">
                      Department
                    </th>
                    <th scope="col" className="px-4 py-3 hidden lg:table-cell">
                      Phone
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b dark:border-gray-400 dark:text-gray-900 dark:bg-gray-200"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-900 dark:bg-gray-200">
                        <div className="flex flex-col">
                          <span>{user.username}</span>
                          <span className="text-xs text-gray-500 sm:hidden ">
                            {user.roleCode || "No role"} •{" "}
                            {user.department || "No dept"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {user.roleCode || "N/A"}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {user.department || "N/A"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {user.phoneNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        <div className="relative">
                          {/* Dropdown button */}
                          <button
                            id={`${user.id}-dropdown-button`}
                            onClick={(e) => handleDropdownClick(e, user.id)}
                            className="inline-flex items-center p-1.5 rounded-lg hover:bg-gray-500/[.25] dark:hover:text-gray-500"
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                          {/* Dropdown menu - shown only when activeDropdown matches user.id */}

                          {activeDropdown === user.id && dropdownPosition && (
                            <div
                              className={`absolute z-50 w-44 rounded-md bg-white shadow-lg dark:bg-gray-700 ${
                                dropdownPosition === "above"
                                  ? "bottom-[calc(100%+0.5rem)]"
                                  : "top-[calc(100%+0.5rem)]"
                              } right-0`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ul className="py-1 px-0 mb-0 dark:text-gray-900 dark:bg-gray-200 ">
                                <li>
                                  <button
                                    onClick={() => {
                                      setUserToRead(user);
                                      setActiveDropdown(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 "
                                  >
                                    <svg
                                      className="mr-2 h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                      />
                                    </svg>
                                    Preview
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenUpdateModal(user.id);
                                      setActiveDropdown(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100  dark:text-gray-900 dark:hover:bg-gray-300 "
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteUser(user.id);
                                      setActiveDropdown(null);
                                    }}
                                    className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-100 dark:text-red-600 dark:hover:bg-red-400"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      viewBox="0 0 14 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        fill="currentColor"
                                        d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 dark:bg-gray-200 rounded-b-2xl shadow-sm"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-600">
                Showing
                <span className="font-semibold text-gray-900 dark:text-gray-800">
                  {" "}
                  {indexOfFirstUser + 1}-
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>
                {" of "}
                <span className="font-semibold text-gray-900 dark:text-gray-800">
                  {filteredUsers.length}
                </span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px dark:border-gray-900">
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center h-full py-1.5 px-3 ml-0 rounded-l-lg border ${
                      currentPage === 1
                        ? "text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-900 dark:text-gray-400 cursor-not-allowed"
                        : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-500"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`flex items-center justify-center text-sm py-2 px-3 leading-tight border ${
                          currentPage === number
                            ? "text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  )
                )}

                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center h-full py-1.5 px-3 leading-tight rounded-r-lg border ${
                      currentPage === totalPages
                        ? "text-gray-400 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed"
                        : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {/* Modals would go here */}
        </section>
        {/* End block */}
        {/* Create modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-51 flex items-center justify-center bg-black/75 dark:bg-black/75 pt-16">
            <div
              id="createUserModal"
              tabIndex={-1}
              aria-hidden={!showCreateModal}
              className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative p-4 w-full max-w-2xl max-h-full ">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add New User
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setShowCreateModal(false)}
                    >
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <form className="p-4 md:p-5" onSubmit={handleCreateUser}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                      {/* Username */}
                      <div>
                        <label
                          htmlFor="username"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={newUser.username || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              username: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter username"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={newUser.email || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              email: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="user@example.com"
                        />
                      </div>

                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={newUser.firstName || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              firstName: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="First name"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={newUser.lastName || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              lastName: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Last name"
                        />
                      </div>

                      {/* Department */}
                      <div>
                        <label
                          htmlFor="department"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={newUser.department || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              department: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Department"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={newUser.phoneNumber || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Phone number"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label
                          htmlFor="roleCode"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                          Role
                        </label>
                        <select
                          id="roleCode"
                          name="roleCode"
                          value={newUser.roleCode || ""}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              roleCode: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                        >
                          <option value="">Select role</option>
                          <option value="admin">Admin</option>
                          <option value="SuperAdmin">Super Admin</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="agent">Agent</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          htmlFor="status"
                          className="block mb-2 text-sm font-medium text-gray-900  dark:text-gray-400"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={newUser.status || "ACTIVE"}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              status: e.target.value as "ACTIVE" | "INACTIVE",
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-3 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <svg
                        className="mr-1 -ml-1 w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add new user
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Update modal */}
        {showUpdateModal && userToUpdate && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 dark:bg-black/75  p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Update User
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-500"
                      onClick={() => setShowUpdateModal(false)}
                    >
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <form className="p-4 md:p-5" onSubmit={handleUpdateUser}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="username"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={userToUpdate.username}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              username: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter username"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={userToUpdate.email || ""}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              email: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="user@example.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={userToUpdate.firstName || ""}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              firstName: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={userToUpdate.lastName || ""}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              lastName: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Last name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="department"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={userToUpdate.department || ""}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              department: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Department"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={userToUpdate.phoneNumber || ""}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="roleCode"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Role
                        </label>
                        <select
                          id="roleCode"
                          name="roleCode"
                          value={userToUpdate.roleCode || ""}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              roleCode: e.target.value,
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="">Select role</option>
                          <option value="admin">Admin</option>
                          <option value="SuperAdmin">Super Admin</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="agent">Agent</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="status"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={userToUpdate.status}
                          onChange={(e) =>
                            setUserToUpdate({
                              ...userToUpdate,
                              status: e.target.value as "ACTIVE" | "INACTIVE",
                            })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center sm:flex-row  ">
                      <button
                        type="submit"
                        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-4 py-2.5 me-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Update user
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(userToUpdate.id)}
                        className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded text-sm px-4 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      >
                        <svg
                          className="mr-1 -ml-1 w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Read modal */}
        {userToRead && (
          <div className=" overflow-y-auto overflow-x-hidden  fixed inset-0 z-52 py-12 sm:pt-0 flex items-center justify-center bg-black/75 dark:bg-black/75 p-2 sm:p-4 ">
            <div className="   relative w-full max-w-xl mx-4  max-h-[calc(100%-1rem)]">
              <div className="relative  bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-5 ">
                <div className=" flex justify-between  rounded-t sm:mb-5 ">
                  <div className="text-lg text-gray-900 md:text-xl dark:text-gray-300 ">
                    <h3 className="font-semibold break-all dark:text-white capitalize mb-3">
                      {userToRead.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {userToRead.firstName} {userToRead.lastName}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-500"
                    onClick={() => setUserToRead(null)}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                {/* User Details - Adjusted for small screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 ">
                  <div className="space-y-1 dark:text-gray-900">
                    <DetailItem label="Email" value={userToRead.email} />
                    <DetailItem label="Role" value={userToRead.roleCode} />
                    <DetailItem
                      label="Department"
                      value={userToRead.department}
                    />
                    <DetailItem label="Phone" value={userToRead.phoneNumber} />
                  </div>
                  <div className="space-y-1.5">
                    <DetailItem label="Status">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          userToRead.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {userToRead.status}
                      </span>
                    </DetailItem>
                    <DetailItem label="Provider" value={userToRead.provider} />
                    <DetailItem
                      label="Business Unit"
                      value={userToRead.businessUnitId}
                    />
                    <DetailItem
                      label="AD ID"
                      value={userToRead.activeDirectoryId?.toString()}
                    />
                  </div>
                </div>

                {/* Metadata Section - Same as original */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className=" text-md text-gray-900 dark:text-white mb-2">
                    Metadata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailItem
                      label="Created At"
                      value={formatDate(userToRead.createdAt)}
                    />
                    <DetailItem
                      label="Modified At"
                      value={formatDate(userToRead.modifiedAt)}
                    />
                    <DetailItem
                      label="Created By"
                      value={userToRead.createdById}
                    />
                    <DetailItem
                      label="Modified By"
                      value={userToRead.modifiedById}
                    />
                  </div>
                </div>

                {/* Action Buttons - Adjusted spacing for small screens */}
                <div className="flex items-center sm:flex-row mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUserToUpdate(userToRead);
                      setShowUpdateModal(true);
                      setUserToRead(null);
                    }}
                    className="inline-flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-4 py-2.5 me-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteUser(userToRead.id);
                      setUserToRead(null);
                    }}
                    className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded text-sm px-4 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};
export default Dashboard;
