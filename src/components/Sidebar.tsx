// sidebar.tsx
"use client";
import {
  LayoutDashboard,
  Users,
  KeySquare,
  Building2,
  ChevronLeft,
  ChevronRight,
  type LucideProps,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export type TabType =
  | "dashboard"
  | "users"
  | "businessUnits"
  | "activeDirectories"
  | "contact";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onTabChange: (tab: TabType) => void;
  activeTab: TabType;
}

interface SidebarLink {
  icon: React.ComponentType<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  tab: TabType;
  path: string;
}

const Sidebar = ({
  collapsed,
  setCollapsed,
  onTabChange,
  activeTab,
}: SidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const getPageTitle = (tab: TabType) => {
    const titles: Record<TabType, string> = {
      dashboard: "Dashboard Overview",
      users: "User Management",
      businessUnits: "Business Units",
      activeDirectories: "Active Directories",
      contact: "Contact Us"
    };
    return `${titles[tab]}`;
  };

  const handleTabClick = (e: React.MouseEvent, tab: TabType) => {
    e.preventDefault();
    e.stopPropagation();
    onTabChange(tab);

    // Use the same path mapping as Dashboard component
    const pathMap: Record<TabType, string> = {
      dashboard: "/dashboard",
      users: "/users",
      businessUnits: "/business-units",
      activeDirectories: "/active-directories",
      contact: "/contact"
    };

    navigate(pathMap[tab]);
    document.title = getPageTitle(tab);
  };

  useEffect(() => {
    document.title = getPageTitle(activeTab);
  }, [activeTab]);

  const sidebarLinks: SidebarLink[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      tab: "dashboard" as TabType,
      path: "/dashboard",
    },
    {
      icon: Users,
      label: "Users",
      tab: "users" as TabType,
      path: "/users", // Direct path
    },
    {
      icon: Building2,
      label: "Business Units",
      tab: "businessUnits" as TabType,
      path: "/business-units", // Direct path
    },
    {
      icon: KeySquare,
      label: "Active Directories",
      tab: "activeDirectories" as TabType,
      path: "/active-directories", // Direct path
    },
  ];

  return (
    <motion.aside
      initial={{ width: collapsed ? 80 : 200 }}
      animate={{ width: collapsed ? 80 : 200 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col border-r bg-white shadow-sm h-full dark:bg-gray-800"
    >
      <nav className="flex flex-col items-center justify-center gap-1 px-3 py-2 h-full dark:bg-gray-800">
        {/* Toggle Button */}
        <div className="relative w-full mb-2 flex justify-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={twMerge(
              clsx(
                "group flex items-center rounded-lg p-3 transition-colors",
                "hover:bg-gray-100 text-gray-600 dark:text-white dark:hover:bg-gray-100/[0.25]",
                !collapsed && "w-full justify-start"
              )
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 whitespace-nowrap text-sm font-medium"
                  >
                    Menu
                  </motion.span>
                </AnimatePresence>
              </>
            )}
          </button>
        </div>

        {sidebarLinks.map((link) => (
          <div
            key={link.tab}
            className="relative w-full flex justify-center"
            onMouseEnter={() => setHoveredItem(link.tab)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              onClick={(e) => handleTabClick(e, link.tab)}
              className={twMerge(
                clsx(
                  "group flex items-center rounded-lg p-3 transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-100/[0.25]",
                  activeTab === link.tab
                    ? "bg-blue-50 text-blue-600 dark:bg-gray-100/[0.25]"
                    : "text-gray-600 dark:text-white",
                  !collapsed && "w-full justify-start"
                )
              )}
            >
              <link.icon className="h-5 w-5" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 whitespace-nowrap text-sm font-medium"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {collapsed && hoveredItem === link.tab && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 10 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 rounded-md bg-gray-800 px-3 py-2 text-sm text-white shadow-lg"
                >
                  {link.label}
                  <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-800" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
