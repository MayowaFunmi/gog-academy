import React from "react";
import { MdSpaceDashboard, MdAssignment, MdBarChart } from "react-icons/md";
import { HiOutlineClipboardCheck, HiUsers } from "react-icons/hi";
import { AiOutlineCheckSquare } from "react-icons/ai";

export interface SubMenuItems {
  title: string;
  icon?: React.ElementType;
  link: string;
}

export interface MenuItems {
  title: string;
  icon: React.ElementType;
  link?: string;
  dropdown?: SubMenuItems[];
}

export const adminMenuItems: MenuItems[] = [
  {
    title: "Dashboard",
    icon: MdSpaceDashboard,
    link: "/admin/dashboard",
  },
  {
    title: "Users",
    icon: HiUsers,
    link: "/admin/users",
  },
  {
    title: "Tasks",
    icon: HiOutlineClipboardCheck,
    link: "/admin/tasks",
  },
  {
    title: "Assignments",
    icon: MdAssignment,
    link: "/admin/assignments",
  },
  {
    title: "Attendance",
    icon: AiOutlineCheckSquare,
    link: "/admin/attendance",
  },
  {
    title: "Reports",
    icon: MdBarChart,
    dropdown: [
      {
        title: "Tasks",
        icon: HiOutlineClipboardCheck,
        link: "/admin/reports/tasks",
      },
      {
        title: "Assignments",
        icon: MdAssignment,
        link: "/admin/reports/assignments",
      },
      {
        title: "Attendance",
        icon: AiOutlineCheckSquare,
        link: "/admin/reports/attendance",
      },
    ],
  },
];

export const studentMenuItems: MenuItems[] = [
  {
    title: "Dashboard",
    icon: MdSpaceDashboard,
    link: "/student/dashboard",
  },
  {
    title: "Tasks",
    icon: HiOutlineClipboardCheck,
    link: "/student/tasks",
  },
  {
    title: "Attendance",
    icon: AiOutlineCheckSquare,
    link: "/student/attendance",
  },
  {
    title: "Assignments",
    icon: MdAssignment,
    link: "/student/assignments",
  },
];
