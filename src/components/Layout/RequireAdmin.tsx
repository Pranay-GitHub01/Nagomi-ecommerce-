import React, { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, isLoading, fetchSession } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      fetchSession();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login', { replace: true });
    }
    // eslint-disable-next-line
  }, [user, isLoading]);

  if (isLoading || !user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default RequireAdmin; 