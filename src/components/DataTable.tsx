import React, { useState, useMemo, useEffect } from "react";
import TableControls from "./TableControls";
import TableContent from "./TableContent";
import Pagination from "./Pagination";
import type { ActiveDirectory, BusinessUnit } from "./modals/CreateUserModal";
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  sortType?: "string" | "number" | "date"; // Add this to specify sort type
  hidden?: boolean;
  breakpoint?: "sm" | "md" | "lg";
}
interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface DataTableProps {
  data: any;
  columns: Column[];
  sortConfig?: SortConfig;
  onSortChange?: (key: string) => void;
  searchKeys: string[];
  statusKey?: string;
  title: string;
  activeTab: string;
  onAddItem: () => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: () => void;
  selectedItems?: string[];
  onSelectItems?: (items: string[]) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  //   sortConfig?: { key: string; direction: "asc" | "desc" };
  //   onSortChange?: (key: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onError?: (error: string | null) => void;
  onResetSort?: () => void;
  onEdit?: (item: any) => void;
    businessUnits?: BusinessUnit[];
    activeDirectories?: ActiveDirectory[];
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  searchKeys,
  statusKey,
  title,
  activeTab,
  onAddItem,
  onDelete,
  onBulkDelete,
  selectedItems = [],
  onSelectItems,
  searchTerm = "",
  onSearchChange,
  statusFilter = "ALL",
  onStatusFilterChange,
  sortConfig,
  onSortChange,
  isLoading = false,
  error = null,
  onError,
  onEdit,
  businessUnits = [], // Add default value
  activeDirectories = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const defaultSortConfig = useMemo(() => {
    const firstSortable = columns.find((col) => col.sortable);
    return firstSortable
      ? { key: firstSortable.key, direction: "asc" as const }
      : undefined;
  }, [columns]);
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortConfig]);

  // Filter, sort, and paginate data
  const { filteredData, currentItems, totalPages } = useMemo(() => {
    // 1. Apply search filter
    let filtered = searchTerm
      ? data.filter((item) =>
          searchKeys.some((key) =>
            String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : [...data];

    // 2. Apply status filter
    if (statusKey && statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item[statusKey] === statusFilter);
    }

    // 3. Apply sorting
    const sorted = sortConfig
      ? [...filtered].sort((a, b) => {
          const column = columns.find((col) => col.key === sortConfig.key);
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];

          // Handle null/undefined values
          if (aValue === undefined || aValue === null) return 1;
          if (bValue === undefined || bValue === null) return -1;
          if (aValue === bValue) return 0;

          // Type-specific comparison
          if (column?.sortType === "number") {
            const numA = Number(aValue);
            const numB = Number(bValue);
            return sortConfig.direction === "asc" ? numA - numB : numB - numA;
          }

          if (column?.sortType === "date") {
            // Proper date comparison with block scope
            const timeA = new Date(aValue).getTime();
            const timeB = new Date(bValue).getTime();
            return sortConfig.direction === "asc"
              ? timeA - timeB
              : timeB - timeA;
          }

          // Default string comparison (case insensitive)
          const strA = String(aValue).toLowerCase();
          const strB = String(bValue).toLowerCase();
          return sortConfig.direction === "asc"
            ? strA.localeCompare(strB)
            : strB.localeCompare(strA);
        })
      : filtered;

    // 4. Apply pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
    const total = Math.ceil(sorted.length / itemsPerPage);

    return {
      filteredData: sorted,
      currentItems: paginatedItems,
      totalPages: total,
    };
  }, [
    data,
    searchTerm,
    statusFilter,
    sortConfig,
    currentPage,
    itemsPerPage,
    searchKeys,
    statusKey,
    columns,
  ]);

  const handleResetSort = () => {
    if (defaultSortConfig && onSortChange) {
      onSortChange(defaultSortConfig.key);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectItems) return;
    onSelectItems(e.target.checked ? filteredData.map((item) => item.id) : []);
  };

  const handleSelectItem = (id: string, isSelected: boolean) => {
    if (!onSelectItems) return;
    onSelectItems(
      isSelected
        ? [...selectedItems, id]
        : selectedItems.filter((itemId) => itemId !== id)
    );
  };
  return (
    <div className="space-y-4">
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => onError?.(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            &times;
          </button>
        </div>
      )}
      <TableControls
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        title={title}
        activeTab={activeTab}
        onAddItem={onAddItem}
        sortConfig={sortConfig}
        onSortChange={onSortChange}
        onResetSort={handleResetSort}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        selectedCount={selectedItems.length}
        onBulkDelete={onBulkDelete}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <TableContent
            items={filteredData}
            columns={columns}
            sortConfig={sortConfig}
            onSort={onSortChange}
            onDelete={onDelete}
            onBulkDelete={onBulkDelete}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            activeTab={activeTab}
            onEdit={onEdit}
            searchTerm={searchTerm} // Make sure this is passed
            onSearchChange={onSearchChange}
            businessUnits={businessUnits} // Pass the data
            activeDirectories={activeDirectories} // Pass the data
          />

          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              entityType={"businessUnits"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;
