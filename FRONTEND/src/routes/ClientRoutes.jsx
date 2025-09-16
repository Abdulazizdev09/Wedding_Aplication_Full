// routes/ClientRoutes.jsx - Keep as is!
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ClientLayout from '../layouts/ClientLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import AllHalls from '../pages/client/AllHalls';
import SingleHall from '../pages/client/SingleHall';
import Home from '../pages/client/Home';
import MyBookings from '../pages/client/MyBookings';
import BookingPage from '../pages/client/BookingPage';

function ClientRoutes() {
    return (
        <Routes>
            <Route element={<ClientLayout />}>
                {/* Public routes */}
                <Route index element={<Home />} />
                <Route path="halls" element={<AllHalls />} />
                <Route path="halls/:hall_id" element={<SingleHall />} />

                {/* Protected routes */}
                <Route path="my-bookings" element={
                    <ProtectedRoute>
                        <MyBookings />
                    </ProtectedRoute>
                } />

                <Route path="halls/:hall_id/book" element={
                    <ProtectedRoute>
                        <BookingPage />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
}

export default ClientRoutes;