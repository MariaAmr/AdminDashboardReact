"use client";
import React, { useState, useMemo, useEffect } from "react";
import DataTable from "../components/DataTable";
import userData from "../usersData.json";
import businessUnitData from "../businessUnitData.json";
import activeDirectoryData from "../activeDirectoryData.json";
import Sidebar, { type TabType } from "../components/Sidebar";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CreateUserModal from "../components/modals/CreateUserModal";
import CreateBusinessUnitModal from "../components/modals/CreateBusinessUnitModal";
import CreateActiveDirectoryModal from "../components/modals/CreateActiveDirectoryModal";
import Pagination from "../components/Pagination";
import EditModal from "../components/EditModal";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  provider?: string | null;
  roleCode: string;
  businessUnitId?: string | null;
  status: string;
  firstName: string;
  lastName: string;
  department: string;
  phoneNumber?: string;
  createdById?: string;
  createdOn?: string;
  modifiedOn?: string;
  modifiedById?: string;
}

interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface ActiveDirectory {
  id: string;
  name: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Data states
  const [users, setUsers] = useState<User[]>(() => {
    return userData.map(
      (user) =>
        ({
          ...user,
          // Only add properties that need transformation or don't exist in user
        } as User)
    );
  });
  const [businessUnits, setBusinessUnits] =
    useState<BusinessUnit[]>(businessUnitData);
  const [activeDirectories, setActiveDirectories] =
    useState<ActiveDirectory[]>(activeDirectoryData);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [newBusinessUnit, setNewBusinessUnit] = useState<Partial<BusinessUnit>>(
    {}
  );
  const [newActiveDirectory, setNewActiveDirectory] = useState<
    Partial<ActiveDirectory>
  >({});

  // Get the appropriate data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case "users":
        return users;
      case "businessUnits":
        return businessUnits;
      case "activeDirectories":
        return activeDirectories;
      default:
        return [];
    }
  }, [activeTab, users, businessUnits, activeDirectories]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPages, setCurrentPages] = useState({
    users: 1,
    businessUnits: 1,
    activeDirectories: 1,
  });
  //handle edit functionality
  const [editingItem, setEditingItem] = useState<any>(null);

  const navigate = useNavigate();
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdate = (updatedItem: any) => {
    switch (activeTab) {
      case "users":
        setUsers(
          users.map((user) => (user.id === updatedItem.id ? updatedItem : user))
        );
        break;
      case "businessUnits":
        setBusinessUnits(
          businessUnits.map((unit) =>
            unit.id === updatedItem.id ? updatedItem : unit
          )
        );
        break;
      case "activeDirectories":
        setActiveDirectories(
          activeDirectories.map((ad) =>
            ad.id === updatedItem.id ? updatedItem : ad
          )
        );
        break;
    }
    setShowEditModal(false);
    setEditingItem(null);
  };

  //   const { paginatedData, totalItems } = useMemo(() => {
  //   const data = currentData;
  //   const currentPage = currentPages[activeTab] || 1;
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;

  //   return {
  //     paginatedData: data.slice(startIndex, endIndex),
  //     totalItems: data.length,
  //   };
  // }, [currentData, currentPages, activeTab, itemsPerPage]);

  // const handlePageChange = (page: number) => {
  //   setCurrentPages((prev) => ({
  //     ...prev,
  //     [activeTab]: page,
  //   }));
  // };
  const { paginatedData, totalItems } = useMemo(() => {
    const data = currentData;
    const currentPage = currentPages[activeTab] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      paginatedData: data.slice(startIndex, endIndex),
      totalItems: data.length,
    };
  }, [currentData, currentPages, activeTab, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [activeTab]: page,
    }));
  };
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "username", direction: "asc" });

  const tableConfig = useMemo(() => {
    switch (activeTab) {
      case "users":
        return {
          title: "Users",
          columns: [
            {
              key: "username",
              label: "Username",
              sortable: true,
              sortType: "string",
            },
            { key: "email", label: "Email", sortable: true },
            {
              key: "firstName",
              label: "First Name",
              sortable: true,
              breakpoint: "md",
            },
            {
              key: "lastName",
              label: "Last Name",
              sortable: true,
              breakpoint: "md",
            },
            { key: "roleCode", label: "Role", sortable: true },
            { key: "status", label: "Status", sortable: true },
          ],
          searchKeys: [
            "username",
            "email",
            "firstName",
            "lastName",
            "roleCode",
          ],
          statusKey: "status" as keyof User,
        };
      case "businessUnits":
        return {
          title: "Business Units",
          columns: [
            { key: "name", label: "Name", sortable: true },
            { key: "code", label: "Code", sortable: true },
            { key: "description", label: "Description" },
          ],
          searchKeys: ["name", "code", "description"],
        };
      case "activeDirectories":
        return {
          title: "Active Directories",
          columns: [
            { key: "name", label: "Name", sortable: true },
            { key: "description", label: "Description" },
          ],
          searchKeys: ["name", "description"],
        };
      default:
        return {
          title: "Dashboard",
          columns: [],
          searchKeys: [],
        };
    }
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  const handleAddItem = () => {
    // Reset create form data when opening create modal
    switch (activeTab) {
      case "users":
        setNewUser({ status: "ACTIVE" });
        break;
      case "businessUnits":
        setNewBusinessUnit({});
        break;
      case "activeDirectories":
        setNewActiveDirectory({});
        break;
    }
    setShowCreateModal(true);
  };
  const handleSortChange = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPages((prev) => ({ ...prev, [activeTab]: 1 })); // Reset to page 1
  };
  const handleCreateUser = (userData: Partial<User>) => {
    const newId = Math.random().toString(36).substring(2, 9);
    setUsers([...users, { ...userData, id: newId } as User]);
    setShowCreateModal(false);
    setNewUser({ status: "ACTIVE" });
    setCurrentPages((prev) => ({ ...prev, users: 1 }));
  };

  const handleCreateBusinessUnit = (businessUnit: BusinessUnit) => {
    setBusinessUnits([...businessUnits, businessUnit]);
    setShowCreateModal(false);
    setNewBusinessUnit({});
  };
  const handleCreateActiveDirectory = (directory: ActiveDirectory) => {
    setActiveDirectories([...activeDirectories, directory]);
    setShowCreateModal(false);
    setNewActiveDirectory({});
  };
  const renderCreateModal = () => {
    switch (activeTab) {
      case "users":
        return (
          <CreateUserModal
            show={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setNewUser({ status: "ACTIVE" });
            }}
            onSubmit={handleCreateUser}
            userData={newUser}
            setUserData={setNewUser}
            isEditing={false}
          />
        );
      case "businessUnits":
        return (
          <CreateBusinessUnitModal
            show={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setNewBusinessUnit({});
            }}
            onSubmit={handleCreateBusinessUnit}
            businessUnitData={newBusinessUnit}
            setBusinessUnitData={setNewBusinessUnit}
          />
        );
      case "activeDirectories":
        return (
          <CreateActiveDirectoryModal
            show={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setNewActiveDirectory({});
            }}
            onSubmit={handleCreateActiveDirectory}
            activeDirectoryData={newActiveDirectory}
            setActiveDirectoryData={setNewActiveDirectory}
          />
        );
      default:
        return null;
    }
  };
  const renderEditModal = () => {
    if (!editingItem) return null;

    switch (activeTab) {
      case "users":
        return (
          <EditModal
            item={editingItem}
            onClose={() => {
              setShowEditModal(false);
              setEditingItem(null);
            }}
            onSave={handleUpdate}
            type={activeTab}
            isEditing={true}
          />
        );
      case "businessUnits":
        return (
          <EditModal
            item={editingItem}
            onClose={() => {
              setShowEditModal(false);
              setEditingItem(null);
            }}
            onSave={handleUpdate}
            type={activeTab}
            isEditing={true}
          />
        );
      case "activeDirectories":
        return (
          <EditModal
            item={editingItem}
            onClose={() => {
              setShowEditModal(false);
              setEditingItem(null);
            }}
            onSave={handleUpdate}
            type={activeTab}
            isEditing={true}
          />
        );
      default:
        return null;
    }
  };
  const handleDelete = (id: string) => {
    switch (activeTab) {
      case "users":
        setUsers(users.filter((user) => user.id !== id));
        break;
      case "businessUnits":
        setBusinessUnits(businessUnits.filter((unit) => unit.id !== id));
        break;
      case "activeDirectories":
        setActiveDirectories(activeDirectories.filter((ad) => ad.id !== id));
        break;
    }
  };

  const handleBulkDelete = () => {
    switch (activeTab) {
      case "users":
        setUsers(users.filter((user) => !selectedItems.includes(user.id)));
        break;
      case "businessUnits":
        setBusinessUnits(
          businessUnits.filter((unit) => !selectedItems.includes(unit.id))
        );
        break;
      case "activeDirectories":
        setActiveDirectories(
          activeDirectories.filter((ad) => !selectedItems.includes(ad.id))
        );
        break;
    }
    setSelectedItems([]);
  };
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const path = location.pathname;
    if (path.endsWith("/users")) setActiveTab("users");
    else if (path.endsWith("/business-units")) setActiveTab("businessUnits");
    else if (path.endsWith("/active-directories"))
      setActiveTab("activeDirectories");
    else setActiveTab("dashboard");
  }, [location.pathname]);
   const handleCardClick = (path: string) => {
     navigate(path);
   };

  const dashboardCards = [
    {
      title: "Users Management",
      description: "View and manage all system users.",
      path: "/dashboard/users",
      initial: { opacity: 0, x: -50 },
      delay: 0.2,
    },
    {
      title: "Business Units",
      description: "Manage organizational units.",
      path: "/dashboard/business-units",
      initial: { opacity: 0, y: 50 },
      delay: 0.3,
    },
    {
      title: "Active Directories",
      description: "Configure directory integrations.",
      path: "/dashboard/active-directories",
      initial: { opacity: 0, x: 50 },
      delay: 0.4,
    },
  ];
  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-4.5rem)]">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
        <main
          className="bg-gray-50 dark:bg-gray-900 mt-18 sm:p-5 antialiased 
            w-full mx-auto 
            px-4 sm:px-6 md:px-8 lg:px-10 
            py-4 sm:py-4 md:py-8 lg:pt-4
            overflow-x-hidden"
        >
          <div
            className="bg-white dark:bg-gray-800 relative shadow-md rounded-lg 
              w-full mx-auto 
              px-4 sm:px-6 md:px-8 lg:px-8 
              py-4 sm:py-6 md:py-8 lg:py-8
              max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl"
          >
            {activeTab === "dashboard" ? (
              <div className="py-20 flex flex-col items-center">
                <div className="text-center py-10 animate-fade-in w-full">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-4xl font-bold">
                      Welcome to the Dashboard
                    </h1>
                    <p className="mt-4 mb-15">
                      Select a section from the sidebar or below to view data
                    </p>
                  </motion.div>

                  <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 w-full">
                    {dashboardCards.map((card, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={card.initial}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.5, delay: card.delay }}
                        onClick={() => handleCardClick(card.path)}
                        className="cursor-pointer min-w-0"
                      >
                        <div className="h-full transition-all hover:shadow-lg dark:hover:bg-gray-700/50">
                          <div className="p-5">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                              {card.title}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-3">
                              {card.description}
                            </p>
                            <button className="mt-4 mx-auto gap-2 flex justify-center content-center text-primary-600">
                              Go to{" "}
                              {card.path === "activeDirectories"
                                ? "Directories"
                                : card.title.split(" ")[0]}
                              <svg
                                className="w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <DataTable
                data={paginatedData}
                columns={tableConfig.columns}
                searchKeys={tableConfig.searchKeys}
                statusKey={tableConfig.statusKey}
                title={tableConfig.title}
                activeTab={activeTab}
                onAddItem={handleAddItem}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
                currentPage={currentPages[activeTab]}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
                onEdit={handleEdit}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            )}
            {activeTab !== "dashboard" && (
              <Pagination
                currentPage={currentPages[activeTab]}
                totalPages={Math.ceil(totalItems / itemsPerPage)}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                entityType={
                  activeTab === "users"
                    ? "users"
                    : activeTab === "businessUnits"
                    ? "businessUnits"
                    : "activeDirectory"
                }
              />
            )}
          </div>
        </main>
        {showCreateModal && renderCreateModal()}
        {showEditModal && renderEditModal()}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
