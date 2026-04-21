import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import Home from './pages/Home';
import Work from './pages/Work';
import WorkDetail from './pages/WorkDetail';
import Team from './pages/Team';
import Clients from './pages/Clients';
import Landing from './pages/Landing';

import ClientLogin from './pages/tracking/ClientLogin';
import ClientDashboard from './pages/tracking/ClientDashboard';
import AdminLogin from './pages/tracking/AdminLogin';
import AdminDashboard from './pages/tracking/AdminDashboard';
import AdminClientManage from './pages/tracking/AdminClientManage';
import AdminSettings from './pages/tracking/AdminSettings';

function App() {
  const location = useLocation();

  return (
    <>
      {/* <Loader /> */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<WorkDetail />} />
          <Route path="team" element={<Team />} />
          <Route path="clients" element={<Clients />} />
        </Route>
        <Route path="landing" element={<Landing />} />
        
        {/* Tracking System Routes */}
        <Route path="tracking/login" element={<ClientLogin />} />
        <Route path="tracking/dashboard" element={<ClientDashboard />} />
        <Route path="tracking/admin/login" element={<AdminLogin />} />
        <Route path="tracking/admin/dashboard" element={<AdminDashboard />} />
        <Route path="tracking/admin/client/:id" element={<AdminClientManage />} />
        <Route path="tracking/admin/settings" element={<AdminSettings />} />
      </Routes>
    </>
  );
}

export default App;
