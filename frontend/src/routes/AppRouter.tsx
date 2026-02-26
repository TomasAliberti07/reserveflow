import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Salons from '../pages/Salons';
import Events from '../pages/Events';
import Bebida from '../pages/Bebida';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Bebida/>} />

        {/* Private */}
        <Route path="/dashboard" element={<Login />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/events" element={<Events />} />
        <Route path="/bebidas" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
