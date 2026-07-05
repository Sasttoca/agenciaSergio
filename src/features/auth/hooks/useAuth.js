import { useContext } from 'react';
import { AgencyContext } from '../../../context/AgencyContext';

const useAuth = () => {
  const { currentUser, handleLogin, handleLogout } = useContext(AgencyContext);

  return {
    user: currentUser,
    isAdmin: currentUser?.role === 'admin',
    isWorker: currentUser?.role === 'worker',
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuth;