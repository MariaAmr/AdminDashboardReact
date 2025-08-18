"use client";

import React from "react";

export interface ActiveDirectory {
  id: string;
  name: string;
  description: string;
}

interface CreateActiveDirectoryModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (directory: ActiveDirectory) => void; // Changed to accept complete directory
  activeDirectoryData: Partial<ActiveDirectory>;
  setActiveDirectoryData: React.Dispatch<
    React.SetStateAction<Partial<ActiveDirectory>>
  >;
}

const CreateActiveDirectoryModal: React.FC<CreateActiveDirectoryModalProps> = ({
  show,
  onClose,
  onSubmit,
  activeDirectoryData,
  setActiveDirectoryData,
}) => {
  if (!show) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setActiveDirectoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!activeDirectoryData.name?.trim()) {
      alert("Name is required");
      return;
    }

    // Submit complete directory data
    onSubmit({
      id: Math.random().toString(36).substring(2, 9), // Generate ID
      name: activeDirectoryData.name.trim(),
      description: activeDirectoryData.description?.trim() || "No description", // Default if empty
    });

    // Clear form
    setActiveDirectoryData({
      name: "",
      description: "",
    });
  };

  const handleCancel = () => {
    setActiveDirectoryData({
      name: "",
      description: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-123 flex items-center justify-center bg-black/75 dark:bg-black/75">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New Active Directory
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleCancel}
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
            <div className="grid gap-4 mb-4">
              <div>
                <label
                  htmlFor="ad-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="ad-name"
                  name="name"
                  value={activeDirectoryData.name || ""}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                  placeholder="Enter directory name"
                />
              </div>
              <div>
                <label
                  htmlFor="ad-description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="ad-description"
                  name="description"
                  rows={4}
                  value={activeDirectoryData.description || ""}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter description (optional)"
                />
              </div>
            </div>
            <div className="flex justify-start gap-3">
              <button
                type="submit"
                className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Add Active Directory
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:focus:ring-gray-800"
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

export default CreateActiveDirectoryModal;
