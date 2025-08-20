import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ActiveDirectory, BusinessUnit } from "./CreateUserModal";

interface EditModalProps {
  item: any;
  onClose: () => void;
  onSave: (updatedItem: any) => void;
  type: "users" | "businessUnits" | "activeDirectories";
  isCreating?: boolean;
  businessUnits?: BusinessUnit[]; // Add business units prop
  activeDirectories?: ActiveDirectory[]; // Add active directories prop
}

const roleOptions = [
  { value: "ADMIN", label: "Administrator" },
  { value: "User", label: "User" },
  { value: "manager", label: "Manager" },
  { value: "supervisor", label: "Supervisor" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
];

const EditModal: React.FC<EditModalProps> = ({
  item,
  onClose,
  onSave,
  type,
  isCreating = false,
  businessUnits = [], // Default empty array
  activeDirectories = [], // Default empty array
}) => {
  const getInitialFormData = () => {
    switch (type) {
      case "users":
        return {
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          roleCode: "",
          status: "ACTIVE",
          department: "",
          phoneNumber: "",
          businessUnitId: "",
          activeDirectoryId: "",
        };
      case "businessUnits":
        return { name: "", code: "", description: "" };
      case "activeDirectories":
        return { name: "", description: "" };
      default:
        return {};
    }
  };

  const [formData, setFormData] = useState(() => {
    return item ? { ...getInitialFormData(), ...item } : getInitialFormData();
  });

  useEffect(() => {
    if (item) {
      setFormData((prev) => {
        if (JSON.stringify(item) !== JSON.stringify(prev)) {
          return { ...getInitialFormData(), ...item };
        }
        return prev;
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [item?.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (isCreating) {
      setFormData(getInitialFormData());
    }
  };

  const handleCancel = () => {
    setFormData(getInitialFormData());
    onClose();
  };

  // Get the display label for the current role
  const getCurrentRoleLabel = () => {
    if (!formData.roleCode) return "Select a role";
    const role = roleOptions.find((opt) => opt.value === formData.roleCode);
    return role ? role.label : formData.roleCode;
  };

  const renderFormFields = () => {
    switch (type) {
      case "users":
        return (
          <div className="space-y-4">
            <form>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                {/* Username */}
                <div>
                  <label className="flex mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Username*
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>

                {/* Personal Information */}
                <div>
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>

                {/* Role and Status */}
                <div>
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Role*{" "}
                    <span className="text-sm text-blue-500">
                      ({getCurrentRoleLabel()})
                    </span>
                  </label>
                  <select
                    name="roleCode"
                    value={formData.roleCode || getCurrentRoleLabel()}
                    onChange={handleChange}
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
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status || "ACTIVE"}
                    onChange={handleChange}
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
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>

                {/* Business Unit Dropdown */}
                <div>
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Business Unit
                  </label>
                  <select
                    name="businessUnitId"
                    value={formData.businessUnitId || ""}
                    onChange={handleChange}
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
                  <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Active Directory
                  </label>
                  <select
                    name="activeDirectoryId"
                    value={formData.activeDirectoryId || ""}
                    onChange={handleChange}
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
            </form>
          </div>
        );
      case "businessUnits":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-2">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-2">
                Code*
              </label>
              <input
                type="text"
                name="code"
                value={formData.code || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
                placeholder="Enter business unit code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter description (optional)"
              />
            </div>
          </>
        );
      case "activeDirectories":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-2">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-400 mb-2">
                Description*
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
                placeholder="Enter Active Directory description"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/[0.50] flex items-center justify-center p-6 z-70">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {isCreating ? `Create New ${type}` : `Edit ${type}`}
        </h2>

        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <div className="flex justify-start gap-2 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isCreating ? "Create" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
