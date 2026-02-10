import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Salons from '../pages/Salons';
import Events from '../pages/Events';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Dashboard />} />

        {/* Private */}
        <Route path="/dashboard" element={<Login />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </BrowserRouter>
  );
}
