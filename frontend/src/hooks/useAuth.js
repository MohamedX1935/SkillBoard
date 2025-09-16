import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur du AuthProvider');
  }
  return context;
};

export default useAuth;
