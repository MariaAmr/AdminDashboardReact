import React from "react";
interface TableControlsProps {
  title: string;
  activeTab: string;
  onAddItem: () => void;
  sortConfig?: { key: string; direction: "asc" | "desc" };
  onSortChange?: (key: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  searchTerm,
  onSearchChange,
  title,
  activeTab,
  onAddItem,
  sortConfig,
  onSortChange,
  statusFilter = "ALL",
  onStatusFilterChange,
  selectedCount = 0,
  onBulkDelete,
 
}) => {
  const getEntityName = () => {
    switch (activeTab) {
      case "users":
        return "User";
      case "businessUnits":
        return "Business Unit";
      case "activeDirectories":
        return "Active Directory";
      default:
        return "Item";
    }
  };
  const handleSortDirectionToggle = () => {
    if (sortConfig && onSortChange) {
      onSortChange(sortConfig.key);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-4 px-2 dark:bg-gray-800">
      <div className="w-1/2 md:w-1/2">
        <form
          className="flex justify-between"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
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
              className="ps-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder={`Search ${title}...`}
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 dark:text-gray-700">
        <div className="flex space-x-3">
          <button
            onClick={onAddItem}
            className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            <svg
              class="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              ></path>
            </svg>
            Add {getEntityName()}
          </button>

          {sortConfig && onSortChange && (
            <button
              onClick={handleSortDirectionToggle}
              className="flex items-center justify-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded text-sm px-4 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              title={sortConfig.direction === "asc" ? "Sort Z-A" : "Sort A-Z"}
            >
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {sortConfig.direction === "asc" ? (
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                ) : (
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                )}
              </svg>
              {sortConfig.direction === "asc" ? "Z-A" : "A-Z"}
            </button>
          )}

          {activeTab === "users" && onStatusFilterChange && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
            </select>
          )}

          {selectedCount > 0 && onBulkDelete && (
            <button
              onClick={onBulkDelete}
              className="flex items-center justify-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-4 py-2 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none dark:focus:ring-red-800"
            >
              Delete Selected ({selectedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableControls;
