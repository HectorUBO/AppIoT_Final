import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <h1>App IoT</h1>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/deleted-plots">Parcelas Eliminadas</Link></li>
        <li><Link to="/irrigation-zones">Zonas de Riego</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;