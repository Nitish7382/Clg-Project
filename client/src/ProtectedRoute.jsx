import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  console.log('Stored Role from localStorage:', localStorage.getItem('role'));
  const storedRole = localStorage.getItem('role');
  console.log('Allowed Role:', allowedRole);
  return storedRole === allowedRole ? <Outlet /> : <Navigate to="/forbidden" />;
};

export default ProtectedRoute;
