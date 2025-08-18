"use client";

import React from "react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

interface PreviewModalProps {
  item: any;
  onClose: () => void;
  type: "users" | "businessUnits" | "activeDirectories";
  onEdit: (item: any) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  item,
  onClose,
  type,
  onEdit,
}) => {
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

 const formatValue = (value: any, key: string) => {
   // Hide password fields
   if (key.toLowerCase().includes("password")) return "••••••••";

   // Handle null/undefined
   if (value === null || value === undefined) return "N/A";

   // Handle boolean values
   if (typeof value === "boolean") return value ? "Yes" : "No";

   // Handle arrays
   if (Array.isArray(value)) return value.join(", ");

   // Handle dates
   if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
     try {
       return new Date(value).toLocaleString();
     } catch {
       return String(value);
     }
   }

   return String(value);
 };

  const handleEdit = () => {
    onEdit(item);
    onClose();
  };

 const renderPreviewContent = () => {
   // Filter out sensitive fields
   const filteredItem = Object.fromEntries(
     Object.entries(item).filter(
       ([key]) => !key.toLowerCase().includes("password")
     )
   );

   return (
     <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
       {Object.entries(filteredItem).map(([key, value]) => (
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
          item.username || item.email || `${item.firstName} ${item.lastName}`
        }`;
      case "businessUnits":
        return `Business Unit: ${item.name}`;
      case "activeDirectories":
        return `Active Directory: ${item.name}`;
      default:
        return "Preview";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/[0.50] flex items-center justify-center z-59 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 md:w-1/2 max-w-6xl max-h-[80vh] overflow-y-auto relative">
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
