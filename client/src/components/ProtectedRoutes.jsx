import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (store) => store.auth
  );

  console.log("ProtectedRoute: Checking authentication", {
    isAuthenticated,
    user,
    isLoading,
  });

  if (isLoading) {
    console.log("ProtectedRoute: Rendering loading state");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (user?.forcePasswordChange) {
    console.log("ProtectedRoute: Redirecting to /change-password");
    return <Navigate to="/change-password" replace />;
  }

  return children || <Outlet />;
};

export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const location = useLocation();

  console.log("AuthenticatedUser: Checking authentication", {
    isAuthenticated,
    pathname: location.pathname,
    isLoading,
  });

  if (isLoading) {
    console.log("AuthenticatedUser: Rendering loading state");
    return <div>Loading...</div>;
  }

  if (isAuthenticated && location.pathname === "/login") {
    console.log("AuthenticatedUser: Redirecting to /");
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (store) => store.auth
  );

  console.log("AdminRoute: Checking authentication and role", {
    isAuthenticated,
    userRole: user?.role,
    isLoading,
  });

  if (isLoading) {
    console.log("AdminRoute: Rendering loading state");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("AdminRoute: Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "instructor") {
    console.log("AdminRoute: Redirecting to /");
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};
