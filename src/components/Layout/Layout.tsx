import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`layout ${className}`}>
      <main className="layout__content">
        {children}
      </main>
    </div>
  );
};

export default Layout;