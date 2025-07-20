'use client'

import React, { useState } from "react";
import Link from "next/link";
import {
  MdMenu,
  MdClose,
} from "react-icons/md";
import { usePathname } from "next/navigation";
import { adminMenuItems, MenuItems, studentMenuItems } from "../../utils/MenuItems";
import { useSession } from "next-auth/react";

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.roles?.includes("SuperAdmin");
  const isStudent = session?.user?.roles?.includes("Student");

  const renderMenu = (menuItems: MenuItems[]) => {
    return (
      <div className="w-full relative">
        {/* Mobile Toggle Button */}
        <button
          className="sm:hidden fixed top-4 left-4 z-50 bg-blue-800 text-white p-2 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
          fixed top-15 sm:top-0 left-0 z-40 h-full w-64 sm:w-[20%] bg-white border-r transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
        `}
        >
          {/* Logo */}
          <div className="flex items-center justify-center h-25 border-b">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              GA
            </div>
          </div>

          {/* Menu Items */}
          <nav className="mt-4 px-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.title}>
                <Link
                  href={item.link || "#"}
                  className={`
                  flex items-center gap-3 p-2 rounded-md
                  hover:bg-blue-100 transition-colors duration-150
                  ${pathname === item.link ? "bg-blue-100 font-semibold" : ""}
                `}
                >
                  <item.icon className="text-xl" />
                  <span>{item.title}</span>
                </Link>
                {/* Dropdown */}
                {item.dropdown && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.dropdown.map((sub) => (
                      <Link
                        href={sub.link}
                        key={sub.title}
                        className={`block text-sm px-2 py-1 rounded hover:bg-gray-100 transition-all duration-150 ${pathname === sub.link ? "bg-gray-100 font-medium" : ""
                          }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </div>
    )
  }

  return (
    <div className="">
      {isAdmin ? renderMenu(adminMenuItems) : (isStudent ? renderMenu(studentMenuItems) : null)}
    </div>
  );
}

export default SidebarNav