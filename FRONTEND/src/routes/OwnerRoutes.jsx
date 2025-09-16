import React from 'react';
import { Route, Routes } from 'react-router-dom';

import OwnerLayout from '../layouts/OwnerLayout';
import Dashboard from '../pages/owner/Dashboard';
import MyHallBookings from '../pages/owner/MyHallBookings';
import MyHalls from '../pages/owner/MyHalls';
import SingleHall from '../pages/owner/SingleHall';
import AddHall from '../pages/owner/AddHall';

function OwnerRoutes() {
  return (
    <Routes>
      <Route element={<OwnerLayout />}>
        {/* Dashboard as index route */}
        <Route index element={<Dashboard />} />

        {/* Other owner pages */}
        <Route path="halls" element={<MyHalls />} />
        <Route path="add-hall" element={<AddHall />} />
        <Route path="bookings" element={<MyHallBookings />} />
        <Route path="halls/:hall_id" element={<SingleHall />} />
      </Route>
    </Routes>
  );
}


export default OwnerRoutes;
