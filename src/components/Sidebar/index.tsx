"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProvider } from "@/app/appcontext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItem {
  icon: string; // Icon kembali ke MenuItem
  label: string;
  route: string;
  maxLevel?: number;
  children?: MenuItem[];
}

interface MenuGroup {
  name: string;
  menuItems: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: "dashboard", // Icon di MenuItem
        label: "Dashboard",
        route: "/",
        maxLevel: 3,
      },
      {
        icon: "product", // Icon di MenuItem
        label: "Product",
        route: "#",
        maxLevel: 3,
        children: [
          {
            icon: "list", // Icon untuk child item
            label: "List",
            route: "/product",
            maxLevel: 3,
          },
          {
            icon: "transaction",
            label: "Transaction",
            route: "/transaction",
            maxLevel: 3,
          },
          {
            icon: "stock",
            label: "Stock Opname",
            route: "/stockopname",
            maxLevel: 2,
          },
          {
            icon: "analysis",
            label: "Analysis",
            route: "/analysis",
            maxLevel: 1,
          },
        ],
      },
      {
        icon: "tool", // Icon di MenuItem
        label: "Tools",
        route: "#",
        maxLevel: 2,
        children: [
          {
            icon: "list",
            label: "List",
            route: "/tool",
            maxLevel: 2,
          },
          {
            icon: "loan",
            label: "Loan Transaction",
            route: "/loan",
            maxLevel: 2,
          },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [userlevel, setUserlevel] = useState<string>("");

  useEffect(() => {
    const level = localStorage.getItem("userlevel") ?? "";
    setUserlevel(level);
  }, []);

  // Fungsi untuk memfilter menu berdasarkan level user
  const filterMenuByLevel = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems
      .filter((menuItem) => {
        if (!menuItem.hasOwnProperty("maxLevel")) return true;
        return parseInt(userlevel) <= (menuItem.maxLevel || 0);
      })
      .map((menuItem) => {
        // Filter children jika ada
        const filteredChildren = menuItem.children
          ? menuItem.children.filter((child) => {
              if (!child.hasOwnProperty("maxLevel")) return true;
              return parseInt(userlevel) <= (child.maxLevel || 0);
            })
          : undefined;

        // Return menu item dengan children yang sudah difilter
        return {
          ...menuItem,
          children:
            filteredChildren && filteredChildren.length > 0
              ? filteredChildren
              : undefined,
        };
      })
      .filter((menuItem) => {
        // Hapus menu item yang memiliki children tapi setelah difilter menjadi kosong
        if (menuItem.children && menuItem.children.length === 0) return false;
        return true;
      });
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <div className="flex items-center justify-center">
              <img src={"/images/logo/logo-icon.svg"} alt="Logo" />
              <div className="ml-2 text-2xl text-white">mipa</div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {filterMenuByLevel(group.menuItems).map(
                    (menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    ),
                  )}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
