import React, { useState } from "react";
import PreviewModal from "./modals/PreviewModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditModal from "./EditModal";
interface Column {
  key: string;
  label: string;
  hidden?: boolean;
  breakpoint?: "sm" | "md" | "lg";
  sortable?: boolean;
  // Add type information for proper sorting
  sortType?: "string" | "number" | "date" | "boolean";
}

interface TableItem {
  id: string;
  [key: string]: string | number | boolean | Date | null | undefined;
}

interface TableContentProps {
  items: TableItem[];
  columns: Column[];
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort?: (key: string) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: () => void;
  selectedItems?: string[];
  onSelectItem?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: (item: TableItem) => void;
  activeTab?: string; // Add this
}

const TableContent: React.FC<TableContentProps> = ({
  items,
  columns,
  sortConfig,
  onSort,
  onDelete,
  onBulkDelete,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  onEdit,
  activeTab,
}) => {
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    itemId?: string;
    itemName?: string;
    isBulk?: boolean;
  }>({ show: false });

  const handleDeleteClick = (itemId: string, itemName: string) => {
    setDeleteModal({ show: true, itemId, itemName });
  };

  const handleBulkDeleteClick = () => {
    if (selectedItems.length > 0) {
      setDeleteModal({ show: true, isBulk: true });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.isBulk && onBulkDelete) {
      onBulkDelete();
    } else if (deleteModal.itemId && onDelete) {
      onDelete(deleteModal.itemId);
    }
    setDeleteModal({ show: false });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false });
  };

  const handleSort = (key: string) => {
    if (onSort) onSort(key);
  };

  // Enhanced sorting indicator with better visual feedback
  const getSortIndicator = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return sortConfig.direction === "asc" ? (
      <svg
        className="w-3 h-3 text-blue-600 dark:text-blue-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="w-3 h-3 text-blue-600 dark:text-blue-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  };
const [previewModal, setPreviewModal] = useState<{
  show: boolean;
  item?: any;
}>({ show: false });

// Add this state for edit modal
const [editModal, setEditModal] = useState<{
  show: boolean;
  item?: any;
  isCreating?: boolean; // flag to clear form
}>({ show: false });

  return (
    <>
      <div className="overflow-x-auto rounded-t-2xl">
        {/* Mobile Cards View (hidden on larger screens) */}
        <div className="sm:hidden space-y-3 p-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="space-y-2">
                  {columns
                    .filter((col) => !col.hidden)
                    .map((column) => {
                      const cellValue = item[column.key];
                      let displayValue = "N/A";

                      if (cellValue !== undefined && cellValue !== null) {
                        if (column.key === "status") {
                          displayValue = cellValue.toString();
                        } else if (cellValue instanceof Date) {
                          displayValue = cellValue.toLocaleDateString();
                        } else {
                          displayValue = cellValue.toString();
                        }
                      }

                      if (column.key === "status") {
                        return (
                          <div
                            key={`${item.id}-${column.key}`}
                            className="flex items-center"
                          >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                              {column.label}:
                            </span>
                            <span
                              className={`px-2 py-2 text-xs font-medium rounded-full ${
                                displayValue === "ACTIVE"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : displayValue === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {displayValue}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div key={`${item.id}-${column.key}`} className="flex">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                            {column.label}:
                          </span>
                          <span className="text-sm text-gray-900 dark:text-gray-200 truncate">
                            {displayValue}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setPreviewModal({ show: true, item })}
                    className="text-sm font-medium text-emerald-600 hover:underline"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(item)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const itemName =
                        activeTab === "users"
                          ? item.username ||
                            item.email ||
                            `${item.firstName} ${item.lastName}`.trim() ||
                            "User"
                          : item.name || "Item";
                      handleDeleteClick(item.id, itemName);
                    }}
                    className="text-sm font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              No data found
            </div>
          )}
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <table className="hidden sm:table min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`p-5 group ${
                    column.hidden
                      ? `hidden ${column.breakpoint || "sm"}:table-cell`
                      : ""
                  } ${
                    column.sortable
                      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && (
                      <span className="ml-1">
                        {getSortIndicator(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b dark:border-gray-700 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-700"
                  } hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                  {columns.map((column) => {
                    const cellValue = item[column.key];
                    let displayValue = "N/A";

                    if (cellValue !== undefined && cellValue !== null) {
                      if (column.key === "status") {
                        displayValue = cellValue.toString();
                      } else if (cellValue instanceof Date) {
                        displayValue = cellValue.toLocaleDateString();
                      } else {
                        displayValue = cellValue.toString();
                      }
                    }

                    if (column.hidden && column.breakpoint) {
                      return (
                        <td
                          key={`${item.id}-${column.key}`}
                          className={`px-4 py-3 hidden ${column.breakpoint}:table-cell`}
                        >
                          {displayValue}
                        </td>
                      );
                    } else if (column.hidden) {
                      return (
                        <td
                          key={`${item.id}-${column.key}`}
                          className="px-4 py-3 hidden sm:table-cell"
                        >
                          {displayValue}
                        </td>
                      );
                    } else if (column.key === "status") {
                      const status = displayValue;
                      return (
                        <td
                          key={`${item.id}-${column.key}`}
                          className="px-4 py-3"
                        >
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              status === "ACTIVE"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={`${item.id}-${column.key}`}
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {displayValue}
                        </td>
                      );
                    }
                  })}
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setPreviewModal({ show: true, item })}
                      className="font-medium text-emerald-600 hover:underline"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(item)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const itemName =
                          activeTab === "users"
                            ? item.username ||
                              item.email ||
                              `${item.firstName} ${item.lastName}`.trim() ||
                              "User"
                            : item.name || "Item";
                        handleDeleteClick(item.id, itemName);
                      }}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-4 text-center"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modals */}
        <DeleteConfirmationModal
          show={deleteModal.show}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          itemName={deleteModal.itemName}
          isBulk={deleteModal.isBulk}
        />
        {previewModal.show && (
          <PreviewModal
            item={previewModal.item}
            onClose={() => setPreviewModal({ show: false })}
            type={activeTab as "users" | "businessUnits" | "activeDirectories"}
            onEdit={(item) => {
              setPreviewModal({ show: false });
              setEditModal({ show: true, item });
            }}
          />
        )}
        {editModal.show && (
          <EditModal
            item={editModal.item}
            onClose={() => setEditModal({ show: false })}
            onSave={(updatedItem) => {
              // Call the parent's onEdit handler with the updated item
              if (onEdit) {
                onEdit(updatedItem);
              }
              setEditModal({ show: false });
            }}
            type={activeTab as "users" | "businessUnits" | "activeDirectories"}
          />
        )}
      </div>
    </>
  );
};

export default TableContent;
