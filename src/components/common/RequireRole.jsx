import { useSelector } from 'react-redux';

const RequireRole = ({ children, allowedRoles }) => {
  const { role } = useSelector((state) => state.auth);
  
  if (!allowedRoles.includes(role)) {
    return null; 
  }

  return children;
};

export default RequireRole;