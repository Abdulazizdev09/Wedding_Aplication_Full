import React from "react";
import { Outlet } from "react-router-dom"; // Add this import
import Layout from "./Layout";
import { FaBuilding, FaCalendarAlt, FaHome, FaPlus, FaUsers } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useLocation } from "react-router-dom";

const adminMenuItems = [
  { path: "/admin", label: "Dashboard", icon: <FaHome /> },
  { path: "/admin/halls", label: "All Halls", icon: <FaBuilding /> },
  { path: "/admin/add-hall", label: "Add Hall", icon: <FaPlus /> },
  { path: "/admin/owners", label: "All Owners", icon: <FaUsers /> },
  { path: "/admin/bookings", label: "All Bookings", icon: <FaCalendarAlt /> },
  { path: "/logout", label: "Log out", icon: <BiLogOut /> },
];

const adminRouteTitles = {
  "/admin": "Dashboard",
  "/admin/halls": "All Halls",
  "/admin/owners": "All Owners",
  "/admin/bookings": "All Bookings",
  "/admin/add-hall": "Add Hall",
};

const AdminLayout = () => { // Remove children prop since we're using Outlet
  const location = useLocation();
  const currentPath = location.pathname;

  // Only match paths explicitly in adminRouteTitles
  const headerText = adminRouteTitles[currentPath] || "Admin Page";

  // Find active menu item exactly matching current path
  const activeMenu = adminMenuItems.find(item => item.path === currentPath)?.path || "";

  return (
    <Layout active={activeMenu} headerText={headerText} menuItems={adminMenuItems}>
      <Outlet /> {/* This renders the nested route components */}
    </Layout>
  );
};

export default AdminLayout;