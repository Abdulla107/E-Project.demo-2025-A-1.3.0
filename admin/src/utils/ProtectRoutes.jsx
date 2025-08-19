import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authorization_admin } from '../store/reducers/authReducer';
import { jwtDecode } from 'jwt-decode';

const ProtectRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localLoader, setLocalLoader] = useState(true);

  const { userInfo, token, role, loader } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(authorization_admin({ decoded }));
    }
  }, [token, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoader(false);

      if (!userInfo || !userInfo.id) {
        if (role === 'admin') {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      }

    }, loader ? 40000 : 200); 

    return () => clearTimeout(timer);
  }, [userInfo, role, navigate, loader]);

  if (localLoader) {
    return <div className='px-3 text-xl'>Loading...</div>;
  }

  if (userInfo && userInfo.role === 'admin') {
    return <Outlet />;
  }

  
  if (token && role !== 'admin') {
    return <Navigate to='/admin/login' replace />;
  }
  if (token && role === 'admin') {
    return <Navigate to='/admin/login' replace />;
  }
  if (!token && !role) {
    return <Navigate to='/admin/login' replace />;
  }

  return null;
};

export default ProtectRoutes;
