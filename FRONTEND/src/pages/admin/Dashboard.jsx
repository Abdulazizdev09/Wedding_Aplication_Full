import React from "react";
import "./dashboard.css";

export default function Dashboard({ stats }) {
  // Expect stats = { totalHalls, totalOwners, totalBookings, revenue }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <section className="stats-cards">
        <div className="card total-halls">
          <h2>{stats?.totalHalls ?? 0}</h2>
          <p>Total Wedding Halls</p>
        </div>
        <div className="card total-owners">
          <h2>{stats?.totalOwners ?? 0}</h2>
          <p>Total Owners</p>
        </div>
        <div className="card total-bookings">
          <h2>{stats?.totalBookings ?? 0}</h2>
          <p>Bookings</p>
        </div>
        <div className="card revenue">
          <h2>{stats?.revenue ? stats.revenue.toLocaleString() + " so’m" : "0 so’m"}</h2>
          <p>Revenue</p>
        </div>
      </section>
    </div>
  );
}
