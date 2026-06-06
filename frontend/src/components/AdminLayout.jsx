import React from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className={`admin-layout-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`} dir="ltr">
      <button
        type="button"
        className="admin-sidebar-toggle"
        aria-label="Toggle admin navigation"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <FiMenu />
      </button>
      <div
        className={`admin-sidebar-backdrop ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />
      <AdminSidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
      />
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
