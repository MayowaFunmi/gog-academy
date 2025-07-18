import SideNavbar from "@/app/components/layout/SideNavbar";
import TopNavbar from "@/app/components/layout/TopNavbar";
import React from "react";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <SideNavbar />
      <TopNavbar />
      <div className="bg-gray-100 pt-16 px-5 md:pl-[317px] min-h-screen">
        {children}
      </div>
    </div>
  );
}