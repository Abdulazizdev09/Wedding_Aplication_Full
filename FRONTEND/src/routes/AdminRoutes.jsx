import React from 'react';
import { Route, Routes } from "react-router-dom";

import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import AddHall from '../pages/admin/AddHall';
import AddOwner from '../pages/admin/AddOwner';
import AllBookings from '../pages/admin/AllBookings';
import AllOwners from '../pages/admin/AllOwners';
import SingleHall from '../pages/admin/SingleHall';
import AllHalls from '../pages/admin/AllHalls';

function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                {/* Dashboard as index route */}
                <Route index element={<Dashboard />} />

                {/* Other admin pages */}
                <Route path="add-hall" element={<AddHall />} />
                <Route path="add-owner" element={<AddOwner />} />
                <Route path="bookings" element={<AllBookings />} />
                <Route path="halls" element={<AllHalls />} />
                <Route path="owners" element={<AllOwners />} />

                <Route path="halls/:hall_id" element={<SingleHall />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
