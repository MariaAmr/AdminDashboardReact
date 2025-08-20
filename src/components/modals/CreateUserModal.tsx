import React from "react";

export interface User {
  id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roleCode?: string;
  department?: string;
  phoneNumber?: string;
  status?: string;
  password?: string;
  provider?: string | null;
  businessUnitId?: string | null;
  activeDirectoryId?: string | null;
  createdAt?: string;
  modifiedAt?: string;
  createdById?: string;
  modifiedById?: string;
}

export interface BusinessUnit {
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

interface CreateUserModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
  userData: Partial<User>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  isEditing?: boolean;
  businessUnits: BusinessUnit[]; // Add businessUnits prop
  activeDirectories: ActiveDirectory[]; // Add activeDirectories prop
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  show,
  onClose,
  onSubmit,
  userData,
  setUserData,
  isEditing = false,
  businessUnits = [], // Default to empty array
  activeDirectories = [], // Default to empty array
}) => {
  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "user", label: "User" },
    { value: "manager", label: "Manager" },
    { value: "supervisor", label: "Supervisor" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
  
   
  ];

  const handleClose = () => {
    // Reset to default values
    setUserData({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      roleCode: "",
      status: "ACTIVE", // Keep default status
      department: "",
      phoneNumber: "",
      businessUnitId: "",
      activeDirectoryId: "",
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userData);
    if (!isEditing) {
      // Clear form after submit for create operations
      setUserData({ status: "ACTIVE" } as User);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 pt-6">
      <div className="relative p-14 w-full max-w-2xl max-h-full overflow-y-auto sm:overflow-y-scroll md:overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit User" : "Add New User"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
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
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              {/* Username */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Username*
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>

              {/* Personal Information */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  First Name
                </label>
                <input
                  type="text"
                  value={userData.firstName || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Last Name
                </label>
                <input
                  type="text"
                  value={userData.lastName || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              {/* Role and Status */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Role*
                </label>
                <select
                  value={userData.roleCode || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, roleCode: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  <option value="">Select a role</option>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Status
                </label>
                <select
                  name="status"
                  value={userData.status || "ACTIVE"} // Good - defaults to "ACTIVE"
                  onChange={(e) =>
                    setUserData({ ...userData, status: e.target.value || "ACTIVE" })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department and Contact */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Department
                </label>
                <input
                  type="text"
                  value={userData.department || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, department: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData.phoneNumber || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              {/* Business Unit Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Business Unit
                </label>
                <select
                  value={userData.businessUnitId || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      businessUnitId: e.target.value || null,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select Business Unit</option>
                  {businessUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} {unit.code && `(${unit.code})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Directory Dropdown */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Active Directory
                </label>
                <select
                  value={userData.activeDirectoryId || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      activeDirectoryId: e.target.value || null,
                    })
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select Active Directory</option>
                  {activeDirectories.map((directory) => (
                    <option key={directory.id} value={directory.id}>
                      {directory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-start space-x-3">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {isEditing ? "Update User" : "Create User"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
