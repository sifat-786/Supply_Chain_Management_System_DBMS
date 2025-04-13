import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  console.log('PrivateRoute rendering');
  const { user } = useAuth();
  
  console.log('PrivateRoute - User:', user ? 'exists' : 'not found');
  
  if (!user) {
    console.log('PrivateRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('PrivateRoute - Rendering protected content');
  return children || <Outlet />;
}

export default PrivateRoute; 