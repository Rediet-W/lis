import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProfile, logout } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    handleLogout,
    hasRole,
    hasAnyRole,
  };
};
