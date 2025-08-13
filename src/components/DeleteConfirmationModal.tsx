// components/DeleteConfirmationModal.tsx
import React from "react";

interface DeleteConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isBulk?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onClose,
  onConfirm,
  itemName,
  isBulk = false,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/[0.50] flex items-center justify-center z-58">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {isBulk
            ? "Are you sure you want to delete the selected items?"
            : `Are you sure you want to delete "${itemName || "this item"}"?`}
          <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-start space-x-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md dark:bg-red-700 dark:hover:bg-red-800"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
