import { useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';

// Hook Personalizado Para Simplificar El Acceso A La Autenticación Y Roles
const useAuth = () => {
  const { currentUser, login, logout } = useContext(AgencyContext);

  return {
    user: currentUser,
    isAdmin: currentUser?.role === 'admin',
    isWorker: currentUser?.role === 'worker',
    isClient: currentUser?.role === 'client',
    login,
    logout,
  };
};

export default useAuth;