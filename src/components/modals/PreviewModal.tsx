"use client";

import React from "react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { ActiveDirectory, BusinessUnit } from "./CreateUserModal";

interface PreviewModalProps {
  item: any;
  onClose: () => void;
  type: "users" | "businessUnits" | "activeDirectories";
  onEdit: (item: any) => void;
  businessUnits?: BusinessUnit[];
  activeDirectories?: ActiveDirectory[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  item,
  onClose,
  type,
  onEdit,
  businessUnits = [],
  activeDirectories = [],
}) => {
  const formatLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      createdAt: "Created At",
      modifiedAt: "Modified At",
      createdById: "Created By",
      modifiedById: "Modified By",
      businessUnitId: "Business Unit",
      activeDirectoryId: "Active Directory",
    };

    return (
      labels[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
  };

const formatValue = (value: any, key: string) => {
  // Handle status first to avoid any date parsing issues
  if (key === "status") {
    // Check if it's a valid status value, not a date
    const validStatuses = ["ACTIVE", "INACTIVE", "PENDING"];
    if (validStatuses.includes(String(value).toUpperCase())) {
      return String(value).toUpperCase();
    }
    return "ACTIVE"; // Default to ACTIVE if invalid
  }

  // Hide password fields
  if (key.toLowerCase().includes("password")) return "••••••••";

  // Handle null/undefined
  if (value === null || value === undefined) return "N/A";

  // Handle boolean values
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // Handle arrays
  if (Array.isArray(value)) return value.join(", ");

  // Handle dates - only for specific known date fields
  if (key === "createdAt" || key === "modifiedAt") {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "N/A"; // Check if valid date
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "N/A";
    }
  }

  // Handle other potential date fields carefully
  if (
    key.toLowerCase().includes("date") &&
    !key.toLowerCase().includes("status")
  ) {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return String(value); // Return original if not a date
      return date.toLocaleDateString();
    } catch {
      return String(value);
    }
  }

  // Handle business unit ID
  if (key === "businessUnitId") {
    if (!value || businessUnits.length === 0) return "N/A";
    const businessUnit = businessUnits.find(
      (bu) => String(bu.id) === String(value)
    );
    return businessUnit ? businessUnit.name : "N/A";
  }

  // Handle active directory ID
  if (key === "activeDirectoryId") {
    if (!value || activeDirectories.length === 0) return "N/A";
    const activeDirectory = activeDirectories.find(
      (ad) => String(ad.id) === String(value)
    );
    return activeDirectory ? activeDirectory.name : "N/A";
  }

  return String(value);
};

  const handleEdit = () => {
    onEdit(item);
    onClose();
  };

  const renderPreviewContent = () => {
    // Filter out sensitive fields and organize the order
    const filteredItem = Object.fromEntries(
      Object.entries(item).filter(
        ([key]) => !key.toLowerCase().includes("password")
      )
    );

    // Define preferred field order
    const fieldOrder = [
      "username",
      "email",
      "firstName",
      "lastName",
      "roleCode",
      "status",
      "department",
      "phoneNumber",
      "businessUnitId",
      "activeDirectoryId",
      "provider",
      "createdAt",
      "modifiedAt",
      "createdById",
      "modifiedById",
    ];

    // Sort fields by preferred order
    const sortedEntries = Object.entries(filteredItem).sort(
      ([keyA], [keyB]) => {
        const indexA = fieldOrder.indexOf(keyA);
        const indexB = fieldOrder.indexOf(keyB);
        if (indexA === -1 && indexB === -1) return keyA.localeCompare(keyB);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }
    );

    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {sortedEntries.map(([key, value]) => (
          <div key={key} className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 truncate">
              {formatLabel(key)}
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600 min-h-[3rem] break-words">
              <p className="text-gray-900 dark:text-gray-200 text-sm">
                {formatValue(value, key)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getTitle = () => {
    switch (type) {
      case "users":
        return `User: ${
          item.username ||
          item.email ||
          `${item.firstName} ${item.lastName}` ||
          "Unknown User"
        }`;
      case "businessUnits":
        return `Business Unit: ${item.name || "Unknown"}`;
      case "activeDirectories":
        return `Active Directory: ${item.name || "Unknown"}`;
      default:
        return "Preview";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/[0.50] flex items-center justify-center z-59 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 md:w-1/2 max-w-xl max-h-[80vh] overflow-y-auto relative">
        {/* Close button (X icon) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 dark:text-white truncate">
          {getTitle()}
        </h2>

        <div className="overflow-x-auto">{renderPreviewContent()}</div>

        <div className="flex flex-col sm:flex-row justify-start gap-2 mt-4 sm:mt-6">
          <button
            onClick={handleEdit}
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Edit
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
