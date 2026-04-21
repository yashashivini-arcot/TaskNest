import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, role = 'student' }) => {
  return (
    <div className={`min-h-screen bg-primary transition-colors duration-500 ${role === 'admin' || role === 'faculty' ? 'theme-faculty' : ''}`}>
      <Navbar role={role === 'admin' ? 'faculty' : role} />
      <main className="px-6 py-10 md:py-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
