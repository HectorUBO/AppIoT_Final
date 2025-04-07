import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SecurityVerification from './pages/Auth/SecurityVerification';
import PrivateRoute from './services/PrivateRoute';
import DeletedPlots from './pages/DeletedPlots/DeletedPlots';
import IrrigationZones from './pages/IrrigationZones/IrrigationZones';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-security" element={<SecurityVerification />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deleted-plots" element={<DeletedPlots />} />
          <Route path="/irrigation-zones" element={<IrrigationZones/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
