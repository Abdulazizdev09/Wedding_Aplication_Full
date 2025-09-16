import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Client/Header";
import Footer from "../components/Client/Footer";

const ClientLayout = () => {
  return (
    <>
      <Header />
      <main className="client-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ClientLayout;
