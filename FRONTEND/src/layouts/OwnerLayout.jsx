import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaHome, FaBuilding, FaCalendarAlt, FaPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Layout from "./Layout";

const ownerMenuItems = [
  { path: "/owner", label: "Dashboard", icon: <FaHome /> },
  { path: "/owner/halls", label: "My Halls", icon: <FaBuilding /> },
  { path: "/owner/add-hall", label: "Add Hall", icon: <FaPlus /> },
  { path: "/owner/bookings", label: "My Hall Bookings", icon: <FaCalendarAlt /> },
  { path: "/logout", label: "Log out", icon: <BiLogOut /> },
];

const ownerRouteTitles = {
  "/owner": "Dashboard",
  "/owner/halls": "My Halls",
  "/owner/add-hall": "Add Hall",
  "/owner/bookings": "My Hall Bookings",
};

const OwnerLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Dynamically set header text based on current route
  const headerText = ownerRouteTitles[currentPath] || "Owner Page";

  // Find the active menu item matching current path
  const activeMenu = ownerMenuItems.find((item) => item.path === currentPath)?.path || "";

  return (
    <Layout active={activeMenu} headerText={headerText} menuItems={ownerMenuItems}>
      <Outlet />
    </Layout>
  );
};

export default OwnerLayout;
